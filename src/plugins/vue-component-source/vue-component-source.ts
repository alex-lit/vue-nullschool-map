import kebabCase from 'lodash/kebabCase';

/**
 * Default plugin parameters
 */
const defaults = {
  /**
   * Is the plugin included?
   */
  enabled: true,
};

/**
 * Generates comment text
 *
 * @param tagName Component tag
 * @param filePath Component file path
 */
const generateComment = (tagName: string | undefined, filePath: string | undefined): string => {
  let comment: string = '';

  if (tagName) comment += `<${tagName}>`;
  if (filePath) comment += `(source: "${filePath}")`;

  return comment;
};

/**
 * Plugin installation
 *
 * @param Vue
 * @param options
 */
function install(Vue, options) {
  const config = { ...defaults, ...options };

  Vue.mixin({
    mounted() {
      if (this.$el && config.enabled) {
        /** Comment */
        const comment: string = generateComment(
          kebabCase((this as any).$vnode?.componentOptions?.tag),
          (this as any).$vnode?.componentInstance?.$options?.__file,
        );

        /** Insert comments in the DOM */
        if (comment) {
          this.$$COMMENT = {
            START: document.createComment(` ${comment} `),
            END: document.createComment(` /${comment} `),
          };
          this.$el.before(this.$$COMMENT.START);
          this.$el.after(this.$$COMMENT.END);
        }
      }
    },
    beforeDestroy() {
      /** Removing comments */
      if (config.enabled && this.$$COMMENT) {
        this.$$COMMENT.START.remove();
        this.$$COMMENT.END.remove();
        Vue.delete(this.$$COMMENT);
      }
    },
  });
}

export default {
  install,
  defaults,
};
