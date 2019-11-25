import PropTypes from 'prop-types'
import React, { RefObject } from 'react'

import {
  FlatList,
  Image,
  Keyboard,
  ListRenderItemInfo,
  ListViewProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

import LoadEarlier from './LoadEarlier'
import Message from './Message'
import Color from './Color'
import { User, IMessage, Reply } from './types'
import { warning } from './utils'

const defaultCircleSize = 16
const defaultCircleColor = '#007AFF'
const defaultLineWidth = 2
const defaultLineColor = '#007AFF'
const defaultTimeTextColor = 'black'
const defaultDotColor = 'white'
const defaultInnerCircle = 'none'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerAlignTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  headerWrapper: {
    flex: 1,
  },
  listStyle: {
    flex: 1,
  },
  scrollToBottomStyle: {
    opacity: 0.8,
    position: 'absolute',
    right: 10,
    bottom: 30,
    zIndex: 999,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Color.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 1,
  },
  sectionHeader: {
    marginBottom: 15,
    backgroundColor: '#007AFF',
    height: 30,
    justifyContent: 'center',
  },
  sectionHeaderText: {
    color: '#FFF',
    fontSize: 18,
    alignSelf: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    flex: 1,
    //alignItems: 'stretch',
    justifyContent: 'center',
  },
  timeContainer: {
    minWidth: 45,
  },
  time: {
    textAlign: 'right',
    color: defaultTimeTextColor,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 10,
    position: 'absolute',
    left: -8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: defaultDotColor,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    borderLeftWidth: defaultLineWidth,
    flexDirection: 'column',
    flex: 1,
  },
  detail: { paddingTop: 10, paddingBottom: 10 },
  description: {
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#aaa',
    marginTop: 10,
    marginBottom: 10,
  },
})

export interface MessageContainerProps<TMessage extends IMessage> {
  messages?: TMessage[]
  user?: User
  listViewProps: Partial<ListViewProps>
  inverted?: boolean
  loadEarlier?: boolean
  alignTop?: boolean
  scrollToBottom?: boolean
  scrollToBottomStyle?: StyleProp<ViewStyle>
  invertibleScrollViewProps?: any
  extraData?: any
  scrollToBottomOffset?: number
  forwardRef?: RefObject<FlatList<IMessage>>
  renderChatEmpty?(): React.ReactNode
  renderFooter?(props: MessageContainerProps<TMessage>): React.ReactNode
  renderMessage?(props: Message['props']): React.ReactNode
  renderLoadEarlier?(props: LoadEarlier['props']): React.ReactNode
  scrollToBottomComponent?(): React.ReactNode
  onLoadEarlier?(): void
  onQuickReply?(replies: Reply[]): void
}

interface State {
  showScrollBottom: boolean
}

export default class MessageContainer<
  TMessage extends IMessage = IMessage
> extends React.PureComponent<MessageContainerProps<TMessage>, State> {
  static defaultProps = {
    messages: [],
    user: {},
    renderChatEmpty: null,
    renderFooter: null,
    renderMessage: null,
    onLoadEarlier: () => {},
    onQuickReply: () => {},
    inverted: true,
    loadEarlier: false,
    listViewProps: {},
    invertibleScrollViewProps: {},
    extraData: null,
    scrollToBottom: false,
    scrollToBottomOffset: 200,
    alignTop: false,
    scrollToBottomStyle: {},
    circleSize: defaultCircleSize,
    circleColor: defaultCircleColor,
    lineWidth: defaultLineWidth,
    lineColor: defaultLineColor,
    innerCircle: defaultInnerCircle,
    columnFormat: 'single-column-left',
    separator: false,
    showTime: true,
    timeline: false,
  }

  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object),
    user: PropTypes.object,
    renderChatEmpty: PropTypes.func,
    renderFooter: PropTypes.func,
    renderMessage: PropTypes.func,
    renderLoadEarlier: PropTypes.func,
    onLoadEarlier: PropTypes.func,
    listViewProps: PropTypes.object,
    inverted: PropTypes.bool,
    loadEarlier: PropTypes.bool,
    invertibleScrollViewProps: PropTypes.object,
    extraData: PropTypes.object,
    scrollToBottom: PropTypes.bool,
    scrollToBottomOffset: PropTypes.number,
    scrollToBottomComponent: PropTypes.func,
    alignTop: PropTypes.bool,
  }
  constructor(props: any, context: any) {
    super(props, context)

    this.state = {
      showScrollBottom: false,
    }
  }

  componentDidMount() {
    if (this.props.messages && this.props.messages.length === 0) {
      this.attachKeyboardListeners()
    }
  }

  componentWillUnmount() {
    this.detachKeyboardListeners()
  }

  componentDidUpdate(prevProps: MessageContainerProps<TMessage>) {
    if (
      prevProps.messages &&
      prevProps.messages.length === 0 &&
      this.props.messages &&
      this.props.messages.length > 0
    ) {
      this.detachKeyboardListeners()
    } else if (
      prevProps.messages &&
      this.props.messages &&
      prevProps.messages.length > 0 &&
      this.props.messages.length === 0
    ) {
      this.attachKeyboardListeners()
    }
  }

  attachKeyboardListeners = () => {
    const { invertibleScrollViewProps: invertibleProps } = this.props
    if (invertibleProps) {
      Keyboard.addListener(
        'keyboardWillShow',
        invertibleProps.onKeyboardWillShow,
      )
      Keyboard.addListener('keyboardDidShow', invertibleProps.onKeyboardDidShow)
      Keyboard.addListener(
        'keyboardWillHide',
        invertibleProps.onKeyboardWillHide,
      )
      Keyboard.addListener('keyboardDidHide', invertibleProps.onKeyboardDidHide)
    }
  }

  detachKeyboardListeners = () => {
    const { invertibleScrollViewProps: invertibleProps } = this.props
    Keyboard.removeListener(
      'keyboardWillShow',
      invertibleProps.onKeyboardWillShow,
    )
    Keyboard.removeListener(
      'keyboardDidShow',
      invertibleProps.onKeyboardDidShow,
    )
    Keyboard.removeListener(
      'keyboardWillHide',
      invertibleProps.onKeyboardWillHide,
    )
    Keyboard.removeListener(
      'keyboardDidHide',
      invertibleProps.onKeyboardDidHide,
    )
  }

  renderFooter = () => {
    if (this.props.renderFooter) {
      const footerProps = {
        ...this.props,
      }
      return this.props.renderFooter(footerProps)
    }
    return null
  }

  renderLoadEarlier = () => {
    if (this.props.loadEarlier === true) {
      const loadEarlierProps = {
        ...this.props,
      }
      if (this.props.renderLoadEarlier) {
        return this.props.renderLoadEarlier(loadEarlierProps)
      }
      return <LoadEarlier {...loadEarlierProps} />
    }
    return null
  }

  scrollTo(options: { animated?: boolean; offset: number }) {
    if (this.props.forwardRef && this.props.forwardRef.current && options) {
      this.props.forwardRef.current.scrollToOffset(options)
    }
  }

  scrollToBottom = (animated: boolean = true) => {
    const { inverted } = this.props
    if (inverted) {
      this.scrollTo({ offset: 0, animated })
    } else {
      this.props.forwardRef!.current!.scrollToEnd({ animated })
    }
  }

  handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {
      nativeEvent: {
        contentOffset: { y: contentOffsetY },
        contentSize: { height: contentSizeHeight },
        layoutMeasurement: { height: layoutMeasurementHeight },
      },
    } = event
    const { scrollToBottomOffset } = this.props
    if (this.props.inverted) {
      if (contentOffsetY > scrollToBottomOffset!) {
        this.setState({ showScrollBottom: true })
      } else {
        this.setState({ showScrollBottom: false })
      }
    } else {
      if (
        contentOffsetY < scrollToBottomOffset! &&
        contentSizeHeight - layoutMeasurementHeight > scrollToBottomOffset!
      ) {
        this.setState({ showScrollBottom: true })
      } else {
        this.setState({ showScrollBottom: false })
      }
    }
  }

  renderRow = ({ item, index }: ListRenderItemInfo<TMessage>) => {
    if (!item._id && item._id !== 0) {
      warning('GiftedChat: `_id` is missing for message', JSON.stringify(item))
    }
    if (!item.user) {
      if (!item.system) {
        warning(
          'GiftedChat: `user` is missing for message',
          JSON.stringify(item),
        )
      }
      item.user = { _id: 0 }
    }
    const { messages, user, inverted, ...restProps } = this.props
    if (messages && user) {
      const previousMessage =
        (inverted ? messages[index + 1] : messages[index - 1]) || {}
      const nextMessage =
        (inverted ? messages[index - 1] : messages[index + 1]) || {}

      const messageProps: Message['props'] = {
        ...restProps,
        user,
        key: item._id,
        currentMessage: item,
        previousMessage,
        inverted,
        nextMessage,
        position: item.user._id === user._id ? 'right' : 'left',
      }

      // if (this.props.timeline) {
      //   return this._renderRow(messageProps)
      // }

      if (this.props.renderMessage) {
        return this.props.renderMessage(messageProps)
      }
      return <Message {...messageProps} />
    }
    return null
  }

  renderChatEmpty = () => {
    if (this.props.renderChatEmpty) {
      return this.props.renderChatEmpty()
    }
    return <View style={styles.container} />
  }

  renderHeaderWrapper = () => (
    <View style={styles.headerWrapper}>{this.renderLoadEarlier()}</View>
  )

  renderScrollBottomComponent() {
    const { scrollToBottomComponent } = this.props

    if (scrollToBottomComponent) {
      return scrollToBottomComponent()
    }

    return <Text>V</Text>
  }

  renderScrollToBottomWrapper() {
    const propsStyle = this.props.scrollToBottomStyle || {}
    return (
      <View style={[styles.scrollToBottomStyle, propsStyle]}>
        <TouchableOpacity
          onPress={() => this.scrollToBottom()}
          hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}
        >
          {this.renderScrollBottomComponent()}
        </TouchableOpacity>
      </View>
    )
  }

  onLayoutList = () => {
    if (
      !this.props.inverted &&
      !!this.props.messages &&
      this.props.messages!.length
    ) {
      setTimeout(
        () => this.scrollToBottom(false),
        15 * this.props.messages!.length,
      )
    }
  }

  keyExtractor = (item: TMessage) => `${item._id}`

  render() {
    const { inverted } = this.props
    return (
      <View
        style={
          this.props.alignTop ? styles.containerAlignTop : styles.container
        }
      >
        {this.state.showScrollBottom && this.props.scrollToBottom
          ? this.renderScrollToBottomWrapper()
          : null}
        <FlatList
          ref={this.props.forwardRef}
          extraData={this.props.extraData}
          keyExtractor={this.keyExtractor}
          enableEmptySections
          automaticallyAdjustContentInsets={false}
          inverted={inverted}
          data={this.props.messages}
          style={styles.listStyle}
          contentContainerStyle={styles.contentContainerStyle}
          renderItem={this.renderRow}
          {...this.props.invertibleScrollViewProps}
          ListEmptyComponent={this.renderChatEmpty}
          ListFooterComponent={
            inverted ? this.renderHeaderWrapper : this.renderFooter
          }
          ListHeaderComponent={
            inverted ? this.renderFooter : this.renderHeaderWrapper
          }
          onScroll={this.handleOnScroll}
          scrollEventThrottle={100}
          onLayout={this.onLayoutList}
          {...this.props.listViewProps}
        />
      </View>
    )
  }

  _renderRow(rowData) {
    let content = null

    switch (this.props.columnFormat) {
      case 'single-column-left':
        content = (
          <View style={[styles.rowContainer, this.props.rowContainerStyle]}>
            {this._renderTime(rowData)}
            {this._renderEvent(rowData)}
            {this._renderCircle(rowData)}
          </View>
        )
        break
      case 'single-column-right':
        content = (
          <View style={[styles.rowContainer, this.props.rowContainerStyle]}>
            {this._renderEvent(rowData)}
            {this._renderTime(rowData)}
            {this._renderCircle(rowData)}
          </View>
        )
        break
      case 'two-column':
        content =
          rowID % 2 == 0 ? (
            <View style={[styles.rowContainer, this.props.rowContainerStyle]}>
              {this._renderTime(rowData)}
              {this._renderEvent(rowData)}
              {this._renderCircle(rowData)}
            </View>
          ) : (
            <View style={[styles.rowContainer, this.props.rowContainerStyle]}>
              {this._renderEvent(rowData)}
              {this._renderTime(rowData)}
              {this._renderCircle(rowData)}
            </View>
          )
        break
    }
    return <View key={rowID}>{content}</View>
  }

  _renderTime(rowData) {
    if (!this.props.showTime) {
      return null
    }
    var timeWrapper = null
    switch (this.props.columnFormat) {
      case 'single-column-left':
        timeWrapper = {
          alignItems: 'flex-end',
        }
        break
      case 'single-column-right':
        timeWrapper = {
          alignItems: 'flex-start',
        }
        break
      case 'two-column':
        timeWrapper = {
          flex: 1,
          alignItems: rowData % 2 == 0 ? 'flex-end' : 'flex-start',
        }
        break
    }
    return (
      <View style={timeWrapper}>
        <View style={[styles.timeContainer, this.props.timeContainerStyle]}>
          <Text style={[styles.time, this.props.timeStyle]}>
            {rowData.time}
          </Text>
        </View>
      </View>
    )
  }

  _renderEvent(rowData, sectionID, rowID) {
    const lineWidth = rowData.lineWidth
      ? rowData.lineWidth
      : this.props.lineWidth
    const isLast = this.props.renderFullLine
      ? !this.props.renderFullLine
      : this.state.data.slice(-1)[0] === rowData
    const lineColor = isLast
      ? 'rgba(0,0,0,0)'
      : rowData.lineColor
      ? rowData.lineColor
      : this.props.lineColor
    let opStyle = null

    switch (this.props.columnFormat) {
      case 'single-column-left':
        opStyle = {
          borderColor: lineColor,
          borderLeftWidth: lineWidth,
          borderRightWidth: 0,
          marginLeft: 20,
          paddingLeft: 20,
        }
        break
      case 'single-column-right':
        opStyle = {
          borderColor: lineColor,
          borderLeftWidth: 0,
          borderRightWidth: lineWidth,
          marginRight: 20,
          paddingRight: 20,
        }
        break
      case 'two-column':
        opStyle =
          rowID % 2 == 0
            ? {
                borderColor: lineColor,
                borderLeftWidth: lineWidth,
                borderRightWidth: 0,
                marginLeft: 20,
                paddingLeft: 20,
              }
            : {
                borderColor: lineColor,
                borderLeftWidth: 0,
                borderRightWidth: lineWidth,
                marginRight: 20,
                paddingRight: 20,
              }
        break
    }

    return (
      <View
        style={[styles.details, opStyle]}
        onLayout={evt => {
          if (!this.state.x && !this.state.width) {
            const { x, width } = evt.nativeEvent.layout
            this.setState({ x, width })
          }
        }}
      >
        <TouchableOpacity
          disabled={this.props.onEventPress == null}
          style={[this.props.detailContainerStyle]}
          onPress={() =>
            this.props.onEventPress ? this.props.onEventPress(rowData) : null
          }
        >
          <View style={styles.detail}>
            {this.renderDetail(rowData, sectionID, rowID)}
          </View>
          {this._renderSeparator()}
        </TouchableOpacity>
      </View>
    )
  }

  _renderDetail(rowData, sectionID, rowID) {
    let title = rowData.description ? (
      <View>
        <Text style={[styles.title, this.props.titleStyle]}>
          {rowData.title}
        </Text>
        <Text style={[styles.description, this.props.descriptionStyle]}>
          {rowData.description}
        </Text>
      </View>
    ) : (
      <Text style={[styles.title, this.props.titleStyle]}>{rowData.title}</Text>
    )
    return <View style={styles.container}>{title}</View>
  }

  _renderCircle(rowData, sectionID, rowID) {
    var circleSize = rowData.circleSize
      ? rowData.circleSize
      : this.props.circleSize
      ? this.props.circleSize
      : defaultCircleSize
    var circleColor = rowData.circleColor
      ? rowData.circleColor
      : this.props.circleColor
      ? this.props.circleColor
      : defaultCircleColor
    var lineWidth = rowData.lineWidth
      ? rowData.lineWidth
      : this.props.lineWidth
      ? this.props.lineWidth
      : defaultLineWidth

    var circleStyle = null

    switch (this.props.columnFormat) {
      case 'single-column-left':
        circleStyle = {
          width: this.state.x ? circleSize : 0,
          height: this.state.x ? circleSize : 0,
          borderRadius: circleSize / 2,
          backgroundColor: circleColor,
          left: this.state.x - circleSize / 2 + (lineWidth - 1) / 2,
        }
        break
      case 'single-column-right':
        circleStyle = {
          width: this.state.width ? circleSize : 0,
          height: this.state.width ? circleSize : 0,
          borderRadius: circleSize / 2,
          backgroundColor: circleColor,
          left: this.state.width - circleSize / 2 - (lineWidth - 1) / 2,
        }
        break
      case 'two-column':
        circleStyle = {
          width: this.state.width ? circleSize : 0,
          height: this.state.width ? circleSize : 0,
          borderRadius: circleSize / 2,
          backgroundColor: circleColor,
          left: this.state.width - circleSize / 2 - (lineWidth - 1) / 2,
        }
        break
    }

    var innerCircle = null
    switch (this.props.innerCircle) {
      case 'icon':
        let iconSource = rowData.icon ? rowData.icon : this.props.icon
        let iconStyle = {
          height: circleSize,
          width: circleSize,
        }
        innerCircle = (
          <Image
            source={iconSource}
            style={[iconStyle, this.props.iconStyle]}
          />
        )
        break
      case 'dot':
        let dotStyle = {
          height: circleSize / 2,
          width: circleSize / 2,
          borderRadius: circleSize / 4,
          backgroundColor: rowData.dotColor
            ? rowData.dotColor
            : this.props.dotColor
            ? this.props.dotColor
            : defaultDotColor,
        }
        innerCircle = <View style={[styles.dot, dotStyle]} />
        break
    }
    return (
      <View style={[styles.circle, circleStyle, this.props.circleStyle]}>
        {innerCircle}
      </View>
    )
  }

  _renderSeparator() {
    if (!this.props.separator) {
      return null
    }
    return <View style={[styles.separator, this.props.separatorStyle]} />
  }
}
