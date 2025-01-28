import { defaultDropdownStyle } from '@/helper/styleHelper';
import * as DropdownMenuOG from 'zeego/dropdown-menu';

const Root = DropdownMenuOG.Root;

const Trigger = DropdownMenuOG.create((props) => {
  return <DropdownMenuOG.Trigger {...props} />;
}, 'Trigger');

const Content = DropdownMenuOG.create((props) => {
  return <DropdownMenuOG.Content className={defaultDropdownStyle.Content} {...props} />;
}, 'Content');

const Item = DropdownMenuOG.create((props) => {
  return <DropdownMenuOG.Item className={defaultDropdownStyle.Item} {...props} />;
}, 'Item');

const SubTrigger = DropdownMenuOG.create((props) => {
  return <DropdownMenuOG.SubTrigger className={defaultDropdownStyle.SubTrigger} {...props} />;
}, 'SubTrigger');

const SubContent = DropdownMenuOG.create((props) => {
  return <DropdownMenuOG.SubContent className={defaultDropdownStyle.SubContent} {...props} />;
}, 'SubContent');

const ItemTitle = DropdownMenuOG.create((props) => {
  return <DropdownMenuOG.ItemTitle className={defaultDropdownStyle.ItemTitle} {...props} />;
}, 'ItemTitle');

const ItemIcon = DropdownMenuOG.create((props) => {
  return <DropdownMenuOG.ItemIcon className={defaultDropdownStyle.ItemIcon} {...props} />;
}, 'ItemIcon');

const Separator = DropdownMenuOG.create((props) => {
  return <DropdownMenuOG.Separator className={defaultDropdownStyle.Separator} {...props} />;
}, 'Separator');

const Sub = DropdownMenuOG.create((props) => {
  return <DropdownMenuOG.Sub className={defaultDropdownStyle.Sub} {...props} />;
}, 'Sub');

const Group = DropdownMenuOG.create((props) => {
  return <DropdownMenuOG.Group className={defaultDropdownStyle.Group} {...props} />;
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