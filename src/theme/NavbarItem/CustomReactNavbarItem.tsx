import React, { type ReactNode } from 'react';

type CustomReactNavbarItemProps = {
    component: React.ComponentType;
};

export default function CustomReactNavbarItem(props: CustomReactNavbarItemProps) {
    const Component = props.component;
    return <Component />;
}
