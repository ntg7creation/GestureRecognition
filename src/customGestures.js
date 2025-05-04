import {
  Finger,
  FingerCurl,
  FingerDirection,
  GestureDescription,
} from "fingerpose";

/** ☝️ ONE FINGER: Only index up */
const OneFingerGesture = new GestureDescription("one_finger");

OneFingerGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 8.0);
OneFingerGesture.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.1);

[Finger.Thumb, Finger.Middle, Finger.Ring, Finger.Pinky].forEach((finger) => {
  OneFingerGesture.addCurl(finger, FingerCurl.FullCurl, 0.5);
  OneFingerGesture.addCurl(finger, FingerCurl.HalfCurl, 0.3);
});

/** ✌️ THREE FINGERS: Index, Middle, Ring up */
const ThreeFingersGesture = new GestureDescription("three_fingers");

[Finger.Index, Finger.Middle, Finger.Ring].forEach((finger) => {
  ThreeFingersGesture.addCurl(finger, FingerCurl.NoCurl, 3.0);
  ThreeFingersGesture.addDirection(finger, FingerDirection.VerticalUp, 0.1);
});

ThreeFingersGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 1.5);

[Finger.Thumb, Finger.Pinky].forEach((finger) => {
  ThreeFingersGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
  ThreeFingersGesture.addCurl(finger, FingerCurl.HalfCurl, 0.5);
});

/** 🖖 FOUR FINGERS: Thumb curled, others up */
const FourFingersGesture = new GestureDescription("four_fingers");

[Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky].forEach((finger) => {
  FourFingersGesture.addCurl(finger, FingerCurl.NoCurl, 2.9);
  FourFingersGesture.addDirection(finger, FingerDirection.VerticalUp, 0.1);
});

FourFingersGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
FourFingersGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.5);

// /** 🖐 FIVE FINGERS: All extended */
// const FiveFingersGesture = new GestureDescription("five_fingers");

// Finger.all.forEach((finger) => {
//   FiveFingersGesture.addCurl(finger, FingerCurl.NoCurl, 2.0);
// });

// FiveFingersGesture.addDirection(
//   Finger.Thumb,
//   FingerDirection.DiagonalUpLeft,
//   1
// );
// FiveFingersGesture.addDirection(
//   Finger.Thumb,
//   FingerDirection.DiagonalUpRight,
//   1
// );
// FiveFingersGesture.addDirection(
//   Finger.Thumb,
//   FingerDirection.HorizontalLeft,
//   0.1
// );
// FiveFingersGesture.addDirection(
//   Finger.Thumb,
//   FingerDirection.HorizontalRight,
//   0.1
// );

// [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky].forEach((finger) => {
//   FiveFingersGesture.addDirection(finger, FingerDirection.VerticalUp, 0.1);
// });

/** ✊ CLOSED HAND: All curled */
const FistGesture = new GestureDescription("closed_hand");

Finger.all.forEach((finger) => {
  FistGesture.addCurl(finger, FingerCurl.FullCurl, 2.0);
  FistGesture.addCurl(finger, FingerCurl.HalfCurl, 1.0);
});

/** ✌️ VICTORY: Index + Middle up, thumb up, others curled */
const VictoryGesture = new GestureDescription("victory");

[Finger.Index, Finger.Middle].forEach((finger) => {
  VictoryGesture.addCurl(finger, FingerCurl.NoCurl, 4.0);
  VictoryGesture.addDirection(finger, FingerDirection.VerticalUp, 0.1);
});

[Finger.Ring, Finger.Pinky].forEach((finger) => {
  VictoryGesture.addCurl(finger, FingerCurl.FullCurl, 0.7);
  VictoryGesture.addCurl(finger, FingerCurl.HalfCurl, 0.3);
});

export const customGestures = [
  OneFingerGesture,
  ThreeFingersGesture,
  FourFingersGesture,
  // FiveFingersGesture,
  FistGesture,
  VictoryGesture,
];
