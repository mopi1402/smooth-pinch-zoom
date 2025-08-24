import { EasingFunction, EasingType } from "../../types/animationTypes";

export class EasingFunctions {
  static linear(t: number): number {
    return t;
  }

  static easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  static easeOut(t: number): number {
    return t * (2 - t);
  }

  static easeIn(t: number): number {
    return t * t;
  }

  static spring(t: number): number {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }

  static bounce(t: number): number {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }

  static back(t: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  static elastic(t: number): number {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }

  static get(type: EasingType): EasingFunction {
    const functions: Record<EasingType, EasingFunction> = {
      linear: this.linear,
      easeInOut: this.easeInOut,
      easeOut: this.easeOut,
      easeIn: this.easeIn,
      spring: this.spring,
      bounce: this.bounce,
      elastic: this.elastic,
      back: this.back,
    };
    return functions[type] || this.easeInOut;
  }
}
