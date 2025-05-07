import {
  Finger,
  FingerCurl,
  FingerDirection,
  GestureDescription,
} from "fingerpose";

/** ☝️ ONE FINGER: Only index up */
const OneFingerGesture = new GestureDescription("one_finger");
OneFingerGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 5);
OneFingerGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 15);
OneFingerGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 5);
OneFingerGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 5);
OneFingerGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 5);

/** 🤟 THREE FINGERS: Index, Middle, Ring up */
const ThreeFingersGesture = new GestureDescription("three_fingers");
ThreeFingersGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0);
ThreeFingersGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 10);
ThreeFingersGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 10);
ThreeFingersGesture.addCurl(Finger.Ring, FingerCurl.NoCurl, 10);
ThreeFingersGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 5);

/** 🖖 FOUR FINGERS: Thumb curled, others up */
const FourFingersGesture = new GestureDescription("four_fingers");
FourFingersGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0);
FourFingersGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 7);
FourFingersGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 7);
FourFingersGesture.addCurl(Finger.Ring, FingerCurl.NoCurl, 7);
FourFingersGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl, 14);

/** ✊ CLOSED HAND: All curled */
const FistGesture = new GestureDescription("closed_hand");
FistGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 5);
FistGesture.addCurl(Finger.Index, FingerCurl.FullCurl, 15);
FistGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 5);
FistGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 5);
FistGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 5);

/** ✌️ VICTORY: Index + Middle up */
const VictoryGesture = new GestureDescription("victory");
VictoryGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0);
VictoryGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 10);
VictoryGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 10);
VictoryGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 5);
VictoryGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 10);

/** 👍 THUMBS UP: Only thumb up */
const ThumbsUpGesture = new GestureDescription("thumbs_up");
ThumbsUpGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 15);
ThumbsUpGesture.addCurl(Finger.Index, FingerCurl.FullCurl, 5);
ThumbsUpGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 5);
ThumbsUpGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 5);
ThumbsUpGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 5);

export const customGestures = [
  OneFingerGesture,
  ThreeFingersGesture,
  FourFingersGesture,
  FistGesture,
  VictoryGesture,
  ThumbsUpGesture,
];