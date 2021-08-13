# Deep Learning

Turns out deep learning is kind of a big deal right now and for good reason. It's cool, powerful, GPU-friendly, and just pretty great. I wanted to be a part of the fun and realized it wasn't as easy to do for Windows developers. But the good news is that it is actually supported.

Found this useful: <https://www.quora.com/How-does-Enthought-Canopy-compare-to-Anaconda>

The stack:

-   Anaconda x64 (<https://www.continuum.io/downloads>)
    -   Make sure to select the 64-bit version!

Steps:

-   Install Anaconda x64
    -   Alternative could use <http://conda.pydata.org/miniconda.html> but haven't tried it
-   git clone <https://github.com/BVLC/caffe/tree/windows>
-   pip install

# Issues

-   Ran into <https://github.com/BVLC/caffe/issues/782> while working on it and the issue was that my PYTHONPATH was not set to D:\Tools\caffe\Build\x64\Release\pycaffe. Do NOT set it to the subdirectory: D:\Tools\caffe\Build\x64\Release\pycaffe\caffe

# Resources

-   <https://www.scipy.org/install.html>
-   <https://www.enthought.com/products/canopy/>
-   <https://github.com/google/deepdream/blob/master/dream.ipynb>
-   <https://docs.google.com/presentation/d/1UeKXVgRvvxg9OUdh_UiC5G71UMscNPlvArsWER41PsU/edit#slide=id.gc2fcdcce7_216_0>
