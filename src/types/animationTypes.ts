export type EasingFunction = (t: number) => number;
export type EasingType =
  | "linear"
  | "easeInOut"
  | "easeOut"
  | "easeIn"
  | "spring"
  | "bounce"
  | "elastic"
  | "back";

export interface AnimationOptions {
  duration?: number;
  easing?: EasingType;
  onUpdate?: (value: number) => void;
  onComplete?: () => void;
  onCancel?: () => void;
}

export interface AnimationState {
  isActive: boolean;
  startValue: number;
  targetValue: number;
  currentValue: number;
  duration: number;
}
