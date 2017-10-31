// @flow

import React, { Component } from 'react';
import { Animated, View } from 'react-native';
import uuid from 'uuid';

import AnimatableView from '../components/AnimatableView';
import { Animator, type AnimatedValue } from '../types';

class BaseAnimator<D, P: any, S> extends Component<D, P, S>
  implements Animator {
  static defaultProps: $Abstract<D>;

  state: $Abstract<S>;

  getDestinationValue: $Abstract<() => any>;
  getAnimationTransformation: $Abstract<() => Object>;
  reset: $Abstract<() => void>;

  id: string;
  target: ?AnimatableView;
  value: AnimatedValue;
  driverValue: ?AnimatedValue;
  driverInputRange: Array<number>;

  props: P;

  constructor(props: P) {
    super(props);
    this.id = uuid.v4();
    if (props.driverValue) {
      this.driverValue = Object.create(props.driverValue);
    }
    this.driverInputRange = props.driverInputRange;
  }

  componentDidMount() {
    this.target = this.props.getTargetRef();
    this.target.registerAnimationTransformation(
      // $FlowFixMe
      this.getAnimationTransformation(),
    );
  }

  getInitialValue() {
    return this.props.initialValue;
  }

  start() {
    // console.log(`Running ${this.id} to ${JSON.stringify(this.getDestinationValue())} with delay ${this.props.delay}`);
    this.value.stopAnimation();
    Animated.timing(this.value, {
      // $FlowFixMe
      toValue: this.getDestinationValue(),
      duration: this.props.duration,
      delay: this.props.delay,
      easing: this.props.easing,
      useNativeDriver: true,
    }).start(() => this.props.onFinish && this.props.onFinish());
  }

  stop() {
    this.value.stopAnimation();
    Animated.timing(this.value, {
      toValue: this.getInitialValue(),
      duration: this.props.durationBack || this.props.duration,
      delay: this.props.delayBack || this.props.delay,
      easing: this.props.easingBack || this.props.easing,
      useNativeDriver: true,
    }).start(() => this.props.onFinishBack && this.props.onFinishBack());
  }

  render() {
    return (
      <View>
        {this.props.children}
      </View>
    );
  }
}

export default BaseAnimator;