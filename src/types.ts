import { StyleProp, ViewStyle } from 'react-native'

export { ActionsProps } from './Actions'
export { AvatarProps } from './Avatar'
export {
  BubbleProps,
  RenderMessageImageProps,
  RenderMessageVideoProps,
  RenderMessageTextProps,
} from './Bubble'
export { ComposerProps } from './Composer'
export { DayProps } from './Day'
export { GiftedAvatarProps } from './GiftedAvatar'
export { InputToolbarProps } from './InputToolbar'
export { LoadEarlierProps } from './LoadEarlier'
export { MessageProps } from './Message'
export { MessageContainerProps } from './MessageContainer'
export { MessageImageProps } from './MessageImage'
export { MessageTextProps } from './MessageText'
export { QuickRepliesProps } from './QuickReplies'
export { SendProps } from './Send'
export { SystemMessageProps } from './SystemMessage'
export { TimeProps } from './Time'

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export interface LeftRightStyle<T> {
  left: StyleProp<T>
  right: StyleProp<T>
}
type renderFunction = (x: any) => JSX.Element
export interface User {
  _id: string | number
  name?: string
  avatar?: string | renderFunction
}

export interface Reply {
  title: string
  value: string
  messageId?: any
}

export interface QuickReplies {
  type: 'radio' | 'checkbox'
  values: Reply[]
  keepIt?: boolean
}

export interface IMessage {
  _id: string | number
  text: string
  createdAt: Date | number
  user: User
  image?: string
  video?: string
  audio?: string
  system?: boolean
  sent?: boolean
  received?: boolean
  pending?: boolean
  quickReplies?: QuickReplies
}

export type IChatMessage = IMessage

export interface MessageVideoProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  videoStyle?: StyleProp<ViewStyle>
  videoProps?: object
  // TODO: should be LightBox properties
  lightboxProps?: object
}


Skip to content
Search or jump to…

Pull requests
Issues
Marketplace
Explore
 
@mcglabs 
Learn Git and GitHub without any code!
Using the Hello World guide, you’ll start a branch, write comments, and open a pull request.


Johan-dutoit
/
react-native-timeline-feed
22
3
3713
 Code Issues 3 Pull requests 2 Actions Projects 0 Wiki Security Insights
react-native-timeline-feed/src/Types.ts
@Johan-dutoit Johan-dutoit 2.0.0 (#11)
449cba2 on May 15, 2019
105 lines (86 sloc)  1.96 KB
  
/** @format */

import * as React from 'react';
import { ViewStyle, TextStyle, FlatListProps } from 'react-native';

import { Omit } from './Utils';

export interface ItemProps {
  title?: string;
  time?: string;
  description?: string;
  lineWidth?: number;
  lineColor?: string;
  circleColor?: string;
  dotColor?: string;

  //Allow any custom props to also be included
  [x: string]: any;
}

export interface RenderItem {
  rowData: ItemProps;
  sectionID: number;
  rowID: boolean;
}
export interface RenderProps {
  item: ItemProps;
  index: number;
  isLast: boolean;
  props: TimelineProps;
}

type LocalFlatListProps = Omit<FlatListProps<ItemProps>, 'renderItem'>;

export interface TimelineProps extends LocalFlatListProps {
  lineWidth: number;
  lineColor: string;
  circleColor: string;
  dotColor: string;
  endWithCircle: boolean;
  preset: Preset;
  data: ReadonlyArray<ItemProps>;
  renderTime?: (props: RenderProps) => React.ReactElement<any>;
  renderCircle?: (props: RenderProps) => React.ReactElement<any>;
  renderDetail?: (props: RenderProps) => React.ReactElement<any>;
  renderEvent?: (props: RenderProps) => React.ReactElement<any>;
  // renderItem?: (props: RenderProps) => React.ReactElement<any>;

  // !! WIP

  rowStyle?: ViewStyle;
  timeStyle?: ViewStyle;
  timeTextStyle?: TextStyle;
  dotStyle?: ViewStyle;
  lineContainerStyle?: ViewStyle;
  circleStyle?: ViewStyle;
  lineStyle?: ViewStyle;
  eventStyle?: ViewStyle;
  titleTextStyle?: TextStyle;
  descriptionTextStyle?: TextStyle;
  renderFullLine: boolean;
  separator: boolean;
  separatorStyle: object;
  iconStyle: object;
}

export interface RowProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface TimeProps {
  children?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export interface EventProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

export interface TitleProps {
  children?: string;
  textStyle?: TextStyle;
}

export interface DescriptionProps {
  children?: string;
  textStyle?: TextStyle;
}

export interface VerticalProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface LineProps {
  width: number;
  color: string;
  style?: ViewStyle;
}

export interface DotProps {
  color: string;
  style?: ViewStyle;
}

export interface CircleProps {
  color: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export enum Preset {
  'SingleColumnLeft',
  'SingleColumnRight'
}