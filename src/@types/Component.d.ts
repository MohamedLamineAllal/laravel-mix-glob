declare module 'laravel-mix/src/components/Component' {
  import { ComponentInterface } from 'laravel-mix/types/component';
  import type Mix from 'laravel-mix/src/Mix';

  type ComponentType = ComponentInterface & {
    context: Mix;
  };

  export interface ClassComponent {
    prototype: ComponentType;
    new (mix: Mix): ComponentType;
  }

  export const Component: ClassComponent;
}
