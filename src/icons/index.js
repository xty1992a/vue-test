/*
 * 使用svg-sprite-loader将svg挂载到页面上,使用<use>标签引用
 *
 * 为便于使用,注册一个<icon>全局组件
 * 直接使用<icon name="xxx">即可引入图标
 * */

import Vue from "vue";
import "./icon.css";

Vue.component("Icon", {
  functional: true,
  render: (h, context) => (
    <svg
      class={`svg-icon icon-${context.props.name || ""} ${
        context.data.staticClass
      }`}
      aria-hidden="true"
    >
      <use xlinkHref={`#${context.props.name}`} />
    </svg>
  ),
});

const requireAll = (requireContext) =>
  requireContext.keys().map(requireContext);
const req = require.context("./svg", false, /\.svg$/);
const iconMap = requireAll(req);

export default iconMap;
