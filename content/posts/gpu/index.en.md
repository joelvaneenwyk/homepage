---
title: "GPU"
date: 2016-01-27T15:58:26+08:00
lastmod: 2016-01-27T15:58:26+08:00
description: "Explorations into open source build systems for Windows using DosBox."
tags: ["News", "Programming", "JavaScript"]
categories: ["News"]
weight: 2
draft: false
toc:
  auto: false
math:
  enable: true
---

Long have I wanted to create a cross-platform raytracing system that works on Xbox One, PS4, PC and whatever modern platform is in style at the moment. You have some common options including CUDA, OpenCL, and others. Essentially it seems what I want is a cross-platform <https://developer.nvidia.com/optix> written in something like OpenCL or something. There are some path-tracers commercialized for this (e.g. <https://home.otoy.com/render/brigade/>).

This seems to be quite commonly regarded as an impossible task [1]. There are some things that help this along however like with Hemi [2] which attempts to use macros to hide some things.

## Tools

* <https://github.com/GPUOpen-Tools/CodeXL>

## Resources

[1] <https://www.reddit.com/r/compsci/comments/304423/cross_platform_gpu_computation_for_real_time_ray/cpp6rne>
[2] <https://devblogs.nvidia.com/parallelforall/developing-portable-cuda-cc-code-hemi/>
