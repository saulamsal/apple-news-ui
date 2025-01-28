import { defaultDropdownStyle } from '@/helper/styleHelper';
import * as DropdownMenuOG from 'zeego/dropdown-menu';

type RootProps = React.ComponentProps<typeof DropdownMenuOG['Root']>;
type TriggerProps = React.ComponentProps<typeof DropdownMenuOG['Trigger']>;
type ContentProps = React.ComponentProps<typeof DropdownMenuOG['Content']>;
type ItemProps = React.ComponentProps<typeof DropdownMenuOG['Item']>;
type SubTriggerProps = React.ComponentProps<typeof DropdownMenuOG['SubTrigger']>;
type SubContentProps = React.ComponentProps<typeof DropdownMenuOG['SubContent']>;
type ItemTitleProps = React.ComponentProps<typeof DropdownMenuOG['ItemTitle']>;
type ItemIconProps = React.ComponentProps<typeof DropdownMenuOG['ItemIcon']>;
type SeparatorProps = React.ComponentProps<typeof DropdownMenuOG['Separator']>;
type SubProps = React.ComponentProps<typeof DropdownMenuOG['Sub']>;
type GroupProps = React.ComponentProps<typeof DropdownMenuOG['Group']>;

const Root = DropdownMenuOG.create((props: RootProps) => {
  return <DropdownMenuOG.Root {...props} />;
}, 'Root');

const Trigger = DropdownMenuOG.create((props: TriggerProps) => {
  return <DropdownMenuOG.Trigger {...props} />;
}, 'Trigger');

const Content = DropdownMenuOG.create((props: ContentProps) => {
  return <DropdownMenuOG.Content {...props} className={`${defaultDropdownStyle.Content} ${props.className || ''}`} />;
}, 'Content');

const Item = DropdownMenuOG.create((props: ItemProps) => {
  return <DropdownMenuOG.Item {...props} className={`${defaultDropdownStyle.Item} ${props.className || ''}`} />;
}, 'Item');

const SubTrigger = DropdownMenuOG.create((props: SubTriggerProps) => {
  return <DropdownMenuOG.SubTrigger {...props} className={`${defaultDropdownStyle.SubTrigger} ${props.className || ''}`} />;
}, 'SubTrigger');

const SubContent = DropdownMenuOG.create((props: SubContentProps) => {
  return <DropdownMenuOG.SubContent {...props} className={`${defaultDropdownStyle.SubContent} ${props.className || ''}`} />;
}, 'SubContent');

const ItemTitle = DropdownMenuOG.create((props: ItemTitleProps) => {
  return <DropdownMenuOG.ItemTitle {...props} className={`${defaultDropdownStyle.ItemTitle} ${props.className || ''}`} />;
}, 'ItemTitle');

const ItemIcon = DropdownMenuOG.create((props: ItemIconProps) => {
  return <DropdownMenuOG.ItemIcon {...props} className={`${defaultDropdownStyle.ItemIcon} ${props.className || ''}`} />;
}, 'ItemIcon');

const Separator = DropdownMenuOG.create((props: SeparatorProps) => {
  return <DropdownMenuOG.Separator {...props} className={`${defaultDropdownStyle.Separator} ${props.className || ''}`} />;
}, 'Separator');

const Sub = DropdownMenuOG.create((props: SubProps) => {
  return <DropdownMenuOG.Sub {...props} />;
}, 'Sub');

const Group = DropdownMenuOG.create((props: GroupProps) => {
  return <DropdownMenuOG.Group {...props} className={`${defaultDropdownStyle.Group} ${props.className || ''}`} />;
}, 'Group');

export const DropdownMenu = {
  Root,
  Trigger,
  Content,
  Item,
  SubTrigger,
  SubContent,
  ItemTitle,
  ItemIcon,
  Separator,
  Sub,
  Group
};