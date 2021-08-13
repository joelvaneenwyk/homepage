# Emscripten

As it happens, we can't actually build native plugins since VSCode is built off Javascript/Typescript.

I have a vague memory of setting up Emscripten in the past and it not being that painful to setup, but this experience was less than pleasant.

The major issue I ran into was that 'emcc.bat' calls 'Python' but the default version of Python that I use is 32-bit while the binaries included in most standard versions of Emscript are 64-bit. This results in a somewhat obscure error "#todo"

The other problem is that vs-code always assumes that you install the plugin which results in copying files destructively into the MSBuild folder. This is, I suppose, fine for some people, but I want an out-of-the-box solution that just works. To do this, you need to have import statements in the vcxproj file for Visual Studio. This also means significant changes to vs-code.

There is a somewhat good example of this from the UE4 project.

Apparently there is an option to pass the config file path directly to emcc via --em-config. Otherwise it always tries to create one in your user folder which is not ideal.

# Other Notes

First off, let me just say that I am very impressed with the Emscripten project. It is fantastic that people are supporting this and opening up this whole new world to the web.

That being said, I do think the project needs a lot of work and code review. The Python files in emscripten project could really use a pylint pass and some standarization.

## Related

-   <https://github.com/Microsoft/vscode/issues/658>
-   <https://github.com/Microsoft/vscode-vsce/issues/54>
-   <https://github.com/Microsoft/vscode/issues/1589>
-   <https://github.com/electron/electron/blob/master/docs/tutorial/using-native-node-modules.md>
-   <https://github.com/RLovelett/node-sourcekit/issues/14>
-   <https://github.com/cortezcristian/dosbox-client/tree/master/dosbox>
-   <https://github.com/caiiiycuk/js-dos.com/>
-   <https://code.visualstudio.com/docs/tools/samples>
-   <https://github.com/Microsoft/vscode-extension-samples/tree/master/previewhtml-sample>

## Resources

-   <https://github.com/kripken/emscripten/blob/07b87426f898d6e9c677db291d9088c839197291/site/source/docs/building_from_source/manually_integrating_emscripten_with_vs2010.rst>
-   <https://github.com/juj/vs-tool>
-   <https://github.com/james-allison/vs-tool>
