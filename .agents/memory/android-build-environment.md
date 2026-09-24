---
name: Native Android build environment
description: Constraints discovered when building the Expo Android project locally in this workspace
---

The Expo Android project is source-ready and typechecks, but a release APK requires a stable Android SDK, NDK/CMake, and Gradle/JVM environment; the workspace image may not provide a reliable native toolchain.

**Why:** The available system package index provided Java and platform tools but not a complete Android SDK. A temporary official SDK install reached Gradle/CMake, but JVM SIGBUS crashes prevented producing an APK.

**How to apply:** Treat the Android source as ready for an external EAS/CI or local Android build unless a future workspace image has a working SDK and native Gradle toolchain. Do not claim an APK exists without checking `artifacts/mobile/android/app/build/outputs`.

For local attempts, Gradle’s wrapper JVM may crash in `PerfLongVariant::sample()` unless `-XX:-UsePerfData` is applied at Java process startup, and `/tmp` can hit a separate per-mount quota despite free disk space; keep Gradle caches and temp files on the workspace volume. A headless x86_64 emulator also needs `/dev/kvm`; without hardware acceleration it may remain stuck booting and cannot install packages.