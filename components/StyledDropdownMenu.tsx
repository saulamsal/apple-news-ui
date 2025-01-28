import * as DropdownMenu from 'zeego/dropdown-menu';

// Base styles for each component
const defaultStyles = {
  content: "bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/20 py-1 min-w-[200px]",
  item: "px-3 py-2 hover:bg-gray-100/50 active:bg-gray-200/50 flex items-center cursor-pointer select-none outline-none",
  itemTitle: "text-[15px] text-gray-900",
  itemTitleDestructive: "text-[15px] text-red-500",
  itemIcon: "mr-2 w-5 h-5 flex items-center justify-center",
  subTrigger: "px-3 py-2 hover:bg-gray-100/50 active:bg-gray-200/50 flex items-center justify-between cursor-pointer select-none outline-none",
  subContent: "bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/20 py-1 min-w-[200px]"
};

// Helper function to merge default styles with custom classes
const mergeStyles = (defaultStyle: string, customStyle?: string) => {
  return customStyle ? `${defaultStyle} ${customStyle}` : defaultStyle;
};

// Export all components with default styles
export const {
  Root,
  Trigger,
  Group,
  Label,
  Separator,
} = DropdownMenu;

// Export styled components
export const Content = (props: any) => (
  <DropdownMenu.Content 
    {...props} 
    // className={mergeStyles(defaultStyles.content, props.className)}
  />
);

export const Item = (props: any) => (
  <DropdownMenu.Item 
    {...props} 
    // className={mergeStyles(defaultStyles.item, props.className)}
  />
);

export const ItemTitle = (props: any) => (
  <DropdownMenu.ItemTitle 
    {...props} 
    // className={mergeStyles(
    //   props.destructive ? defaultStyles.itemTitleDestructive : defaultStyles.itemTitle, 
    //   props.className
    // )}
  />
);

export const ItemIcon = (props: any) => (
  <DropdownMenu.ItemIcon 
    // className={mergeStyles(defaultStyles.itemIcon, props.className)}
    {...props}  />
);

export const Sub = DropdownMenu.Sub;

export const SubTrigger = (props: any) => (
  <DropdownMenu.SubTrigger 
    {...props} 
    // className={mergeStyles(defaultStyles.subTrigger, props.className)}
  />
);

export const SubContent = (props: any) => (
  <DropdownMenu.SubContent 
    {...props} 
    // className={mergeStyles(defaultStyles.subContent, props.className)}
  />
); 