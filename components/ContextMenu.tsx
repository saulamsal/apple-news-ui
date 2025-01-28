import { defaultDropdownStyle } from '@/helper/styleHelper';
import * as ContextMenuOG from 'zeego/context-menu';

const Root = ContextMenuOG.Root;

const Trigger = ContextMenuOG.create((props: any) => {
  return <ContextMenuOG.Trigger {...props} />;
}, 'Trigger');

const Content = ContextMenuOG.create((props: any) => {
  return <ContextMenuOG.Content className={defaultDropdownStyle.Content} {...props} />;
}, 'Content');

const Item = ContextMenuOG.create((props: any) => {
  return <ContextMenuOG.Item className={defaultDropdownStyle.Item} {...props} />;
}, 'Item');

const SubTrigger = ContextMenuOG.create((props: any) => {
  return <ContextMenuOG.SubTrigger className={defaultDropdownStyle.SubTrigger} {...props} />;
}, 'SubTrigger');

const SubContent = ContextMenuOG.create((props: any) => {
  return <ContextMenuOG.SubContent className={defaultDropdownStyle.SubContent} {...props} />;
}, 'SubContent');

const ItemTitle = ContextMenuOG.create((props: any) => {
  return <ContextMenuOG.ItemTitle className={defaultDropdownStyle.ItemTitle} {...props} />;
}, 'ItemTitle');

const ItemIcon = ContextMenuOG.create((props: any) => {
  return <ContextMenuOG.ItemIcon className={defaultDropdownStyle.ItemIcon} {...props} />;
}, 'ItemIcon');

const ItemImage = ContextMenuOG.create((props: any) => {
  return <ContextMenuOG.ItemImage {...props} />;
}, 'ItemImage');

const ItemSubtitle = ContextMenuOG.create((props: any) => {
  return <ContextMenuOG.ItemSubtitle {...props} />;
}, 'ItemSubtitle');

const Separator = ContextMenuOG.create((props: any) => {
  return <ContextMenuOG.Separator className={defaultDropdownStyle.Separator} {...props} />;
}, 'Separator');

const Sub = ContextMenuOG.create((props: any) => {
  return <ContextMenuOG.Sub {...props} />;
}, 'Sub');

const Group = ContextMenuOG.create((props: any) => {
  return <ContextMenuOG.Group className={defaultDropdownStyle.Group} {...props} />;
}, 'Group');

const Label = ContextMenuOG.create((props: any) => {
  return <ContextMenuOG.Label className={defaultDropdownStyle.Label} {...props} />;
}, 'Label');

const Arrow = ContextMenuOG.create((props: any) => {
  return <ContextMenuOG.Arrow {...props} />;
}, 'Arrow');

const Preview = ContextMenuOG.create((props: any) => {
  return <ContextMenuOG.Preview {...props} />;
}, 'Preview');

const CheckboxItem = ContextMenuOG.create((props: any) => {
  return <ContextMenuOG.CheckboxItem className={defaultDropdownStyle.Item} {...props} />;
}, 'CheckboxItem');

const ItemIndicator = ContextMenuOG.create((props: any) => {
  return <ContextMenuOG.ItemIndicator className={defaultDropdownStyle.ItemIndicator} {...props} />;
}, 'ItemIndicator');

export const ContextMenu = {
  Root,
  Trigger,
  Content,
  Item,
  SubTrigger,
  SubContent,
  ItemTitle,
  ItemIcon,
  ItemImage,
  ItemSubtitle,
  Separator,
  Sub,
  Group,
  Label,
  Arrow,
  Preview,
  CheckboxItem,
  ItemIndicator
}; 