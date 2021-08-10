/*
 * grunt-harp
 * https://github.com/shovon/grunt-harp
 *
 * Copyright (c) 2013 Salehen Shovon Rahman
 * Licensed under the MIT license.
 */

'use strict';

const harp = require("harp");
const path = require("path");

module.exports = function (grunt) {
    grunt.registerTask(
        "harp",
        "A grunt task for either running a Harp server, or compile your site using harp.",
        function() {
            const defaults = {
                server: false,
                port: 9000,
                source: "./",
                dest: "build"
            };
            const options = this.options(defaults, this.data);
            const source = path.resolve(options.source);
            const dest = path.resolve(options.dest);

            // Merge task-specific and/or target-specific options with these defaults.
            const done = this.async();

            if (options.server) {
                grunt.log.writeln("Starting server!");
                harp.server(source, { port: options.port }, function harpServer() {
                    console.log("Harp server running on port %d", options.port);
                    done(null);
                });
            } else {
                try {
                    harp.compile(source, dest, function (err) {
                        if (err) {
                            grunt.fail.fatal(err.message);
                            done(err);
                        } else {
                            grunt.log.writeln("Site successfully compiled!");
                            done(err);
                        }
                    });
                } catch (error) {
                    done(error);
                }
                grunt.log.writeln("Queued up harp!");
            }
        }
    );
};
