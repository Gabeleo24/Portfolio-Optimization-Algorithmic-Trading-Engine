// Type definitions for TradingView widgets
interface TradingViewWidget {
  widget: (config: {
    width?: string | number;
    height?: string | number;
    symbol?: string;
    interval?: string;
    timezone?: string;
    theme?: string;
    style?: string | number;
    locale?: string;
    toolbar_bg?: string;
    enable_publishing?: boolean;
    withdateranges?: boolean;
    hide_side_toolbar?: boolean;
    allow_symbol_change?: boolean;
    details?: boolean;
    hotlist?: boolean;
    calendar?: boolean;
    studies?: string[];
    container_id?: string;
    [key: string]: any;
  }) => void;
}

declare global {
  interface Window {
    TradingView: TradingViewWidget;
  }
}

export {};