import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { TradeTick } from '../types/crypto';
import clsx from 'clsx';

interface Props {
  ticks: TradeTick[];
}

export const TickerFeed: React.FC<Props> = ({ ticks }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: ticks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    overscan: 10, 
  });

  return (
    <div 
      ref={parentRef} 
      className="h-[500px] overflow-auto border border-zinc-800 rounded-lg bg-zinc-950/50 font-mono text-sm shadow-inner"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const tick = ticks[ticks.length - 1 - virtualItem.index];
          if (!tick) return null;

          return (
            <div
              key={tick.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className="flex items-center justify-between px-4 border-b border-zinc-900/50 hover:bg-zinc-900 transition-colors"
            >
              <span className="text-zinc-500 w-32">
                {new Date(tick.timestamp).toLocaleTimeString(undefined, { 
                  hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 
                })}
              </span>
              <span className={clsx(
                "font-semibold w-24 text-right",
                tick.isBuyerMaker ? 'text-red-400' : 'text-emerald-400'
              )}>
                ${tick.price.toFixed(2)}
              </span>
              <span className="text-zinc-300 w-24 text-right">
                {tick.quantity.toFixed(4)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};