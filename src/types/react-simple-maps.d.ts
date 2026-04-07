declare module 'react-simple-maps' {
  import { ComponentType, SVGProps } from 'react';

  interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: any;
    style?: {
      default?: Record<string, string>;
      hover?: Record<string, string>;
      pressed?: Record<string, string>;
    };
    onClick?: (event: React.MouseEvent<SVGPathElement>) => void;
  }

  interface GeographiesProps {
    geography: string | Record<string, any> | Array<Record<string, any>>;
    children: (props: { geographies: any[] }) => React.ReactNode;
  }

  interface ComposableMapProps extends SVGProps<SVGSVGElement> {
    projection?: string;
    width?: number;
    height?: number;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
}
