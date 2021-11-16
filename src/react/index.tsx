import React from 'react';
import { SearchEmbed as _SearchEmbed, SearchViewConfig } from '../embed/search';
import { AppEmbed as _AppEmbed, AppViewConfig } from '../embed/app';
import {
    LiveboardEmbed as _LiveboardEmbed,
    LiveboardViewConfig,
} from '../embed/liveboard';
import { TsEmbed, ViewConfig } from '../embed/ts-embed';

import { EmbedEvent, MessageCallback } from '../types';
import { EmbedProps, getViewPropsAndListeners } from './util';

const componentFactory = <
    T extends typeof TsEmbed,
    U extends EmbedProps,
    V extends ViewConfig
>(
    EmbedConstructor: T,
) => (props: U) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const { className, ...embedProps } = props;
    const { viewConfig, listeners } = getViewPropsAndListeners<
        Omit<U, 'className'>,
        V
    >(embedProps);
    React.useEffect(() => {
        const tsEmbed = new EmbedConstructor(ref!.current, {
            ...viewConfig,
        });
        Object.keys(listeners).forEach((eventName) => {
            tsEmbed.on(
                eventName as EmbedEvent,
                listeners[eventName as EmbedEvent],
            );
        });
        tsEmbed.render();
    }, [embedProps]);

    return <div data-testid="tsEmbed" className={className} ref={ref}></div>;
};

interface SearchProps extends EmbedProps, SearchViewConfig {}

export const SearchEmbed = componentFactory<
    typeof _SearchEmbed,
    SearchProps,
    SearchViewConfig
>(_SearchEmbed);

interface AppProps extends EmbedProps, AppViewConfig {}

export const AppEmbed = componentFactory<
    typeof _AppEmbed,
    AppProps,
    AppViewConfig
>(_AppEmbed);

interface LiveboardProps extends EmbedProps, LiveboardViewConfig {}

export const LiveboardEmbed = componentFactory<
    typeof _LiveboardEmbed,
    LiveboardProps,
    LiveboardViewConfig
>(_LiveboardEmbed);

export const PinboardEmbed = componentFactory<
    typeof _LiveboardEmbed,
    LiveboardProps,
    LiveboardViewConfig
>(_LiveboardEmbed);
