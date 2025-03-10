import React, { type ReactNode } from 'react';
import CustomSolutionsNavbarItem from '../../components/CustomSolutionsNavbarItem';

type CustomReactNavbarItemProps = {
    component: ReactNode;
};


export default function CustomReactNavbarItem(_props: CustomReactNavbarItemProps) {
    return <CustomSolutionsNavbarItem />;
}
