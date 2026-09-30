// Shared, mutable (non-React) state written by ScrollTrigger and read inside useFrame.
export const sceneState = {
  // 0 = hero, 1 = about, 2 = what-i-do
  progress: 0,
  pointerX: 0,
  pointerY: 0,
}
