// types/react.d.ts
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace React {
    interface StatelessComponent<P = {}> {
      (props: P & { children?: React.ReactNode }, context?: any): React.ReactElement<any> | null;
      propTypes?: React.WeakValidationMap<P> | undefined;
      contextTypes?: React.ValidationMap<any> | undefined;
      defaultProps?: Partial<P> | undefined;
      displayName?: string | undefined;
    }
  }
  
  declare module "react" {
    export = React;
    export as namespace React;
  }