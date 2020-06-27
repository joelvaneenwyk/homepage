/* Copyright 2016 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* globals pdfjsLib, pdfjsViewer */

const USE_ONLY_CSS_ZOOM = true;
const TEXT_LAYER_MODE = 0; // DISABLE
const MAX_IMAGE_SIZE = 1024 * 1024;
const CMAP_URL = "/thirdparty/pdfjs-dist/cmaps/";
const CMAP_PACKED = true;

pdfjsLib.GlobalWorkerOptions.workerSrc = "/thirdparty/pdfjs-dist/build/pdf.worker.js";

const DEFAULT_URL = "/data/portfolio/joelvaneenwyk_resume.pdf";
const DEFAULT_SCALE_DELTA = 1.1;
const MIN_SCALE = 0.25;
const MAX_SCALE = 10.0;
const DEFAULT_SCALE_VALUE = "auto";

const PDFViewerApplication = {
    pdfLoadingTask: null,
    pdfDocument: null,
    pdfViewer: null,
    pdfHistory: null,
    pdfLinkService: null,

    /**
    * Opens PDF document specified by URL.
    * @returns {Promise} - Returns the promise, which is resolved when document
    *                      is opened.
    */
    open(params) {
        if (this.pdfLoadingTask) {
            // We need to destroy already opened document
            return this.close().then(() =>
            // ... and repeat the open() call.
                this.open(params));
        }

        const { url } = params;
        const self = this;
        this.setTitleUsingUrl(url);

        // Loading document.
        const loadingTask = pdfjsLib.getDocument({
            url,
            maxImageSize: MAX_IMAGE_SIZE,
            cMapUrl: CMAP_URL,
            cMapPacked: CMAP_PACKED
        });
        this.pdfLoadingTask = loadingTask;

        loadingTask.onProgress = function (progressData) {
            self.progress(progressData.loaded / progressData.total);
        };

        return loadingTask.promise.then((pdfDocument) => {
            // Document loaded, specifying document for the viewer.
            self.pdfDocument = pdfDocument;
            self.pdfViewer.setDocument(pdfDocument);
            self.pdfLinkService.setDocument(pdfDocument);
            self.pdfHistory.initialize({ fingerprint: pdfDocument.fingerprint });

            self.loadingBar.hide();
            self.setTitleUsingMetadata(pdfDocument);
        }, (exception) => {
            const message = exception && exception.message;
            const { l10n } = self;
            let loadingErrorMessage;

            if (exception instanceof pdfjsLib.InvalidPDFException) {
                // change error message also for other builds
                loadingErrorMessage = l10n.get("invalid_file_error", null,
                    "Invalid or corrupted PDF file.");
            } else if (exception instanceof pdfjsLib.MissingPDFException) {
                // special message for missing PDFs
                loadingErrorMessage = l10n.get("missing_file_error", null,
                    "Missing PDF file.");
            } else if (exception instanceof pdfjsLib.UnexpectedResponseException) {
                loadingErrorMessage = l10n.get("unexpected_response_error", null,
                    "Unexpected server response.");
            } else {
                loadingErrorMessage = l10n.get("loading_error", null,
                    "An error occurred while loading the PDF.");
            }

            loadingErrorMessage.then((msg) => {
                self.error(msg, { message });
            });
            self.loadingBar.hide();
        });
    },

    /**
    * Closes opened PDF document.
    * @returns {Promise} - Returns the promise, which is resolved when all
    *                      destruction is completed.
    */
    close() {
        const errorWrapper = document.getElementById("errorWrapper");
        errorWrapper.setAttribute("hidden", "true");

        if (!this.pdfLoadingTask) {
            return Promise.resolve();
        }

        const promise = this.pdfLoadingTask.destroy();
        this.pdfLoadingTask = null;

        if (this.pdfDocument) {
            this.pdfDocument = null;

            this.pdfViewer.setDocument(null);
            this.pdfLinkService.setDocument(null, null);
        }

        return promise;
    },

    get loadingBar() {
        const bar = new pdfjsViewer.ProgressBar("#loadingBar", {});

        return pdfjsLib.shadow(this, "loadingBar", bar);
    },

    setTitleUsingUrl: function pdfViewSetTitleUsingUrl(url) {
        this.url = url;
        let title = pdfjsLib.getFilenameFromUrl(url) || url;
        try {
            title = decodeURIComponent(title);
        } catch (e) {
            // decodeURIComponent may throw URIError,
            // fall back to using the unprocessed url in that case
        }
        this.setTitle(title);
    },

    setTitleUsingMetadata(pdfDocument) {
        const self = this;
        pdfDocument.getMetadata().then((data) => {
            const { info } = data;
            const { metadata } = data;
            self.documentInfo = info;
            self.metadata = metadata;

            // Provides some basic debug information
            console.log(`PDF ${pdfDocument.fingerprint} [${
                info.PDFFormatVersion} ${(info.Producer || "-").trim()
            } / ${(info.Creator || "-").trim()}]`
        + ` (PDF.js: ${pdfjsLib.version || "-"})`);

            let pdfTitle;
            if (metadata && metadata.has("dc:title")) {
                const title = metadata.get("dc:title");
                // Ghostscript sometimes returns 'Untitled', so prevent setting the
                // title to 'Untitled.
                if (title !== "Untitled") {
                    pdfTitle = title;
                }
            }

            if (!pdfTitle && info && info.Title) {
                pdfTitle = info.Title;
            }

            if (pdfTitle) {
                self.setTitle(`${pdfTitle} - ${document.title}`);
            }
        });
    },

    setTitle: function pdfViewSetTitle(title) {
        document.title = title;
        document.getElementById("title").textContent = title;
    },

    error: function pdfViewError(message, moreInfo) {
        const { l10n } = this;
        const moreInfoText = [l10n.get("error_version_info",
            {
                version: pdfjsLib.version || "?",
                build: pdfjsLib.build || "?"
            },
            "PDF.js v{{version}} (build: {{build}})")];

        if (moreInfo) {
            moreInfoText.push(
                l10n.get("error_message", { message: moreInfo.message },
                    "Message: {{message}}")
            );
            if (moreInfo.stack) {
                moreInfoText.push(
                    l10n.get("error_stack", { stack: moreInfo.stack },
                        "Stack: {{stack}}")
                );
            } else {
                if (moreInfo.filename) {
                    moreInfoText.push(
                        l10n.get("error_file", { file: moreInfo.filename },
                            "File: {{file}}")
                    );
                }
                if (moreInfo.lineNumber) {
                    moreInfoText.push(
                        l10n.get("error_line", { line: moreInfo.lineNumber },
                            "Line: {{line}}")
                    );
                }
            }
        }

        const errorWrapper = document.getElementById("errorWrapper");
        errorWrapper.removeAttribute("hidden");

        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = message;

        const closeButton = document.getElementById("errorClose");
        closeButton.onclick = function () {
            errorWrapper.setAttribute("hidden", "true");
        };

        const errorMoreInfo = document.getElementById("errorMoreInfo");
        const moreInfoButton = document.getElementById("errorShowMore");
        const lessInfoButton = document.getElementById("errorShowLess");
        moreInfoButton.onclick = function () {
            errorMoreInfo.removeAttribute("hidden");
            moreInfoButton.setAttribute("hidden", "true");
            lessInfoButton.removeAttribute("hidden");
            errorMoreInfo.style.height = `${errorMoreInfo.scrollHeight}px`;
        };
        lessInfoButton.onclick = function () {
            errorMoreInfo.setAttribute("hidden", "true");
            moreInfoButton.removeAttribute("hidden");
            lessInfoButton.setAttribute("hidden", "true");
        };
        moreInfoButton.removeAttribute("hidden");
        lessInfoButton.setAttribute("hidden", "true");
        Promise.all(moreInfoText).then((parts) => {
            errorMoreInfo.value = parts.join("\n");
        });
    },

    progress: function pdfViewProgress(level) {
        const percent = Math.round(level * 100);
        // Updating the bar if value increases.
        if (percent > this.loadingBar.percent || isNaN(percent)) {
            this.loadingBar.percent = percent;
        }
    },

    get pagesCount() {
        return this.pdfDocument.numPages;
    },

    set page(val) {
        this.pdfViewer.currentPageNumber = val;
    },

    get page() {
        return this.pdfViewer.currentPageNumber;
    },

    zoomIn: function pdfViewZoomIn(ticks) {
        let newScale = this.pdfViewer.currentScale;
        do {
            newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2);
            newScale = Math.ceil(newScale * 10) / 10;
            newScale = Math.min(MAX_SCALE, newScale);
        } while (--ticks && newScale < MAX_SCALE);
        this.pdfViewer.currentScaleValue = newScale;
    },

    zoomOut: function pdfViewZoomOut(ticks) {
        let newScale = this.pdfViewer.currentScale;
        do {
            newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2);
            newScale = Math.floor(newScale * 10) / 10;
            newScale = Math.max(MIN_SCALE, newScale);
        } while (--ticks && newScale > MIN_SCALE);
        this.pdfViewer.currentScaleValue = newScale;
    },

    initUI: function pdfViewInitUI() {
        const linkService = new pdfjsViewer.PDFLinkService();
        this.pdfLinkService = linkService;

        this.l10n = pdfjsViewer.NullL10n;

        const container = document.getElementById("viewerContainer");
        const pdfViewer = new pdfjsViewer.PDFViewer({
            container,
            linkService,
            l10n: this.l10n,
            useOnlyCssZoom: USE_ONLY_CSS_ZOOM,
            textLayerMode: TEXT_LAYER_MODE
        });
        this.pdfViewer = pdfViewer;
        linkService.setViewer(pdfViewer);

        this.pdfHistory = new pdfjsViewer.PDFHistory({
            linkService
        });
        linkService.setHistory(this.pdfHistory);

    /* Not supporting these buttons
    document.getElementById('previous').addEventListener('click', function() {
    PDFViewerApplication.page--;
    });

    document.getElementById('next').addEventListener('click', function() {
    PDFViewerApplication.page++;
    });

    document.getElementById('zoomIn').addEventListener('click', function() {
    PDFViewerApplication.zoomIn();
    });

    document.getElementById('zoomOut').addEventListener('click', function() {
    PDFViewerApplication.zoomOut();
    });

    document.getElementById('pageNumber').addEventListener('click', function() {
    this.select();
    });

    document.getElementById('pageNumber').addEventListener('change',
        function() {
    PDFViewerApplication.page = (this.value | 0);

    // Ensure that the page number input displays the correct value,
    // even if the value entered by the user was invalid
    // (e.g. a floating point number).
    if (this.value !== PDFViewerApplication.page.toString()) {
        this.value = PDFViewerApplication.page;
    }
    });

    document.addEventListener('pagesinit', function () {
    // We can use pdfViewer now, e.g. let's change default scale.
    pdfViewer.currentScaleValue = DEFAULT_SCALE_VALUE;
    });

    document.addEventListener('pagechanging', function (evt) {
    var page = evt.detail.pageNumber;
    var numPages = PDFViewerApplication.pagesCount;

    document.getElementById('pageNumber').value = page;
    document.getElementById('previous').disabled = (page <= 1);
    document.getElementById('next').disabled = (page >= numPages);
    }, true);
    */
    }
};

document.addEventListener("DOMContentLoaded", () => {
    PDFViewerApplication.initUI();
}, true);

(function animationStartedClosure() {
    // The offsetParent is not set until the PDF.js iframe or object is visible.
    // Waiting for first animation.
    PDFViewerApplication.animationStartedPromise = new Promise(
        ((resolve) => {
            window.requestAnimationFrame(resolve);
        })
    );
}());

// We need to delay opening until all HTML is loaded.
PDFViewerApplication.animationStartedPromise.then(() => {
    PDFViewerApplication.open({
        url: DEFAULT_URL
    });
});
