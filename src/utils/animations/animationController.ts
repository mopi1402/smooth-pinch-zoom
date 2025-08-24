import { AnimationOptions, AnimationState } from "../../types/animationTypes";
import { EasingFunctions } from "./easingFunctions";
/**
 * Controller for managing smooth animations using requestAnimationFrame
 */
export class AnimationController {
  private animationFrameId?: number;
  private currentAnimation?: AnimationState;
  private targetFPS: number = 60;
  private frameInterval: number = 1000 / 60;

  constructor() {}

  public animate(
    startValue: number,
    targetValue: number,
    options: AnimationOptions = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cancel();

      const duration = options.duration ?? 300;
      const easing = options.easing ?? "easeInOut";
      const valueDelta = targetValue - startValue;

      if (Math.abs(valueDelta) < 0.001) {
        options.onComplete?.();
        resolve();
        return;
      }

      const startTime = performance.now();
      const easingFunction = EasingFunctions.get(easing);

      this.currentAnimation = {
        isActive: true,
        startValue,
        targetValue,
        currentValue: startValue,
        startTime,
        duration,
      };

      const animate = (currentTime: number) => {
        if (!this.currentAnimation?.isActive) {
          options.onCancel?.();
          reject(new Error("Animation cancelled"));
          return;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFunction(progress);

        const currentValue = startValue + valueDelta * easedProgress;

        this.currentAnimation.currentValue = currentValue;

        options.onUpdate?.(currentValue);

        if (progress < 1) {
          // Gestion du FPS constant pour un rendu fluide
          const nextFrameTime = currentTime + this.frameInterval;
          this.animationFrameId = requestAnimationFrame((timestamp) => {
            if (timestamp >= nextFrameTime) {
              animate(timestamp);
            } else {
              // Attendre le bon moment pour le prochain frame
              setTimeout(() => {
                this.animationFrameId = requestAnimationFrame(animate);
              }, nextFrameTime - timestamp);
            }
          });
        } else {
          this.currentAnimation.isActive = false;
          this.currentAnimation = undefined;
          this.animationFrameId = undefined;

          // Final update with exact target value
          options.onUpdate?.(targetValue);
          const currentValue = startValue + valueDelta * easedProgress;

          options.onComplete?.();
          resolve();
        }
      };

      this.animationFrameId = requestAnimationFrame(animate);
    });
  }

  public async animateKeyframes(
    keyframes: number[],
    options: AnimationOptions = {}
  ): Promise<void> {
    if (keyframes.length < 2) {
      throw new Error("At least 2 keyframes are required");
    }

    const segmentDuration = (options.duration ?? 1000) / (keyframes.length - 1);

    for (let i = 0; i < keyframes.length - 1; i++) {
      await this.animate(keyframes[i], keyframes[i + 1], {
        ...options,
        duration: segmentDuration,
      });
    }
  }

  public cancel(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }

    if (this.currentAnimation) {
      this.currentAnimation.isActive = false;
      this.currentAnimation = undefined;
    }
  }

  public isAnimating(): boolean {
    return this.currentAnimation?.isActive ?? false;
  }

  public getState(): AnimationState | undefined {
    return this.currentAnimation ? { ...this.currentAnimation } : undefined;
  }

  public getProgress(): number {
    if (!this.currentAnimation?.isActive) return 0;

    const elapsed = performance.now() - this.currentAnimation.startTime;
    return Math.min(elapsed / this.currentAnimation.duration, 1);
  }

  public setTargetFPS(fps: number): void {
    this.targetFPS = Math.max(30, Math.min(120, fps)); // Limite entre 30 et 120 FPS
    this.frameInterval = 1000 / this.targetFPS;
  }

  public getTargetFPS(): number {
    return this.targetFPS;
  }

  public destroy(): void {
    this.cancel();
  }
}
