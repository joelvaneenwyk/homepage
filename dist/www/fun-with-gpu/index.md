# Fun with the GPU

Got the shader handling classes implemented!! Yay! It now loads the shaders, compiles them, and links them together. The scene manager renders all passes, and each pass uses the correct shaders (vertex and/or fragment) and initializes their parameters properly. Now the task is to get XML working for loading and saving the shaders. These XML files will hold the data for a material in general, so each material doesn't have to have shaders...it can just use the texture units and traditional blending if that does the trick. The shader builder I'll be creating will export to this XML format, so the builder can create shaders and generic (old-school) materials.

Also need to get a packaging system in place (like the .pk3 files in Q3), to store all the shaders, textures, and models. This will need to have the option of being password protected, however, as that will prove to be useful in some cases.
