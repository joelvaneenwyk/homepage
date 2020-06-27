/* jslint node: true */

const mimetypes = require("mime-types");
const path = require("path");
const helpers = require("harp/lib/helpers");
const pkg = require("harp/package.json");
const terraform = require("terraform");
const beautifyHtml = require("js-beautify").html;
const { minify } = require("html-minifier");

const runPrettify = function customPrettify(html) {
    const doMinify = false;
    let formatted = html;

    if (doMinify) {
        formatted = minify(formatted,
            {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                removeComments: true
            });
    }

    formatted = beautifyHtml(formatted, { indent_size: 2 });

    return formatted;
};

const runCustomProcess = function customProcess(req, rsp, next) {
    const normalizedPath = helpers.normalizeUrl(`/public/${req.url}`);
    const normalizedIndexPath = helpers.normalizeUrl(`/public/${req.url}/index`);
    let priorityList = terraform.helpers.buildPriorityList(normalizedPath);
    priorityList = priorityList.concat(terraform.helpers.buildPriorityList(normalizedIndexPath));
    let sourceFile = terraform.helpers.findFirstFile(req.setup.publicPath, priorityList);

    /**
    * We GTFO if we don't have a source file.
    */
    if (!sourceFile) {
        if (path.basename && path.basename(normalizedPath) === "index.html") {
            const pathAr = normalizedPath.split(path.sep);
            pathAr.pop(); // Pop index.html off the list
            const prospectCleanPath = pathAr.join("/");
            const prospectNormalizedPath = helpers.normalizeUrl(prospectCleanPath);
            const prospectPriorityList = terraform.helpers.buildPriorityList(prospectNormalizedPath);
            prospectPriorityList.push(path.basename(`${prospectNormalizedPath}.html`));

            sourceFile = terraform.helpers.findFirstFile(req.setup.publicPath, prospectPriorityList);

            if (!sourceFile) {
                return next();
            }
            // 301 redirect
            rsp.statusCode = 301;
            rsp.setHeader("Location", prospectCleanPath);
            rsp.end(`Redirecting to ${prospectCleanPath}`);
        } else {
            return next();
        }
    } else {
    /**
    * Now we let terraform handle the asset pipeline.
    */
        req.poly.render(sourceFile, (error, body) => {
            if (error) {
                error.stack = helpers.stacktrace(error.stack, { lineno: error.lineno });

                const locals = {
                    project: req.headers.host,
                    error,
                    pkg
                };
                if (terraform.helpers.outputType(sourceFile) === "css") {
                    const outputType = terraform.helpers.outputType(sourceFile);
                    const mimeType = helpers.mimeType(outputType);
                    const charset = mimetypes.charset(mimeType);
                    const bodyInternal = helpers.cssError(locals);
                    rsp.statusCode = 200;
                    rsp.setHeader("Content-Type", mimeType + (charset ? `; charset=${charset}` : ""));
                    rsp.setHeader("Content-Length", Buffer.byteLength(bodyInternal, charset));
                    rsp.end(bodyInternal);
                } else {
                    terraform.root(path.join(__dirname, "templates"))
                        .render("error.jade", locals, (err, body) => {
                            if (err) {
                                console.log(err.stack);
                            }
                            const mimeType = helpers.mimeType("html");
                            const charset = mimetypes.charset(mimeType);
                            rsp.statusCode = 500;
                            rsp.setHeader("Content-Type", mimeType + (charset ? `; charset=${charset}` : ""));
                            rsp.setHeader("Content-Length", Buffer.byteLength(body, charset));
                            rsp.end(body);
                        });
                }
            } else {
                // 404
                if (!body) return next();

                const formatted = runPrettify(body);

                const outputTypeInternal = terraform.helpers.outputType(sourceFile);
                const mimeTypeInternal = helpers.mimeType(outputTypeInternal);
                const charsetInternal = mimetypes.charset(mimeTypeInternal);
                rsp.statusCode = 200;
                rsp.setHeader("Content-Type", mimeTypeInternal + (charsetInternal ? `; charset=${charsetInternal}` : ""));
                rsp.setHeader("Content-Length", Buffer.byteLength(formatted, charsetInternal));
                rsp.end(formatted);
            }
        });
    }

    return true;
};

function prettify(harp) {
    // Override the process call and format the HTML after processing it
    harp.middleware.process = runCustomProcess;
}

module.exports = {
    prettify,
    html_prettify: runPrettify
};
