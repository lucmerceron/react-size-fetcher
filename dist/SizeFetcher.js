'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getDisplayName = function getDisplayName(wrappedComponent) {
  return wrappedComponent.displayName || wrappedComponent.name || 'Component';
};
var isStateless = function isStateless(component) {
  return !component.render && !(component.prototype && component.prototype.render);
};

/*
* Size Inversion Inheritence Higher Order Component
* This component is usefull when you need a transparant way for knowing the size of a sub component
* It will call the sizeChange function when the size of the sub component is first known and then everytime it changes
*/
var SizeFetcher = function SizeFetcher(sizeChange) {
  return function (SubComponent) {
    var component = SubComponent;
    var ComposedComponent = component;

    // Managing component without state (functional component)
    if (isStateless(ComposedComponent)) {
      ComposedComponent = function (_React$Component) {
        _inherits(ComposedComponent, _React$Component);

        function ComposedComponent() {
          _classCallCheck(this, ComposedComponent);

          return _possibleConstructorReturn(this, (ComposedComponent.__proto__ || Object.getPrototypeOf(ComposedComponent)).apply(this, arguments));
        }

        _createClass(ComposedComponent, [{
          key: 'render',
          value: function render() {
            return component(this.props);
          }
        }]);

        return ComposedComponent;
      }(_react2.default.Component);
      ComposedComponent.displayName = getDisplayName(component);
    }

    var Enhancer = function (_ComposedComponent) {
      _inherits(Enhancer, _ComposedComponent);

      function Enhancer() {
        _classCallCheck(this, Enhancer);

        return _possibleConstructorReturn(this, (Enhancer.__proto__ || Object.getPrototypeOf(Enhancer)).apply(this, arguments));
      }

      _createClass(Enhancer, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          if (_get(Enhancer.prototype.__proto__ || Object.getPrototypeOf(Enhancer.prototype), 'componentDidMount', this)) _get(Enhancer.prototype.__proto__ || Object.getPrototypeOf(Enhancer.prototype), 'componentDidMount', this).call(this);

          var id = this.props.id;
          var _comp = this.comp,
              clientHeight = _comp.clientHeight,
              clientWidth = _comp.clientWidth,
              scrollHeight = _comp.scrollHeight,
              scrollWidth = _comp.scrollWidth;

          // First call of the callback, the component mounted and we need to give its size

          sizeChange(id, { clientHeight: clientHeight, clientWidth: clientWidth, scrollHeight: scrollHeight, scrollWidth: scrollWidth });

          // Register the dimension for future sake (comparison)
          this.privateRegisterComponentInfos();

          // Register an event listener on the resize so we are concious of possible size change
          window.addEventListener('resize', this.privateHandleSizeMayHaveChanged.bind(this));
        }
      }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
          if (_get(Enhancer.prototype.__proto__ || Object.getPrototypeOf(Enhancer.prototype), 'componentDidUpdate', this)) _get(Enhancer.prototype.__proto__ || Object.getPrototypeOf(Enhancer.prototype), 'componentDidUpdate', this).call(this);

          this.privateHandleSizeMayHaveChanged();
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          if (_get(Enhancer.prototype.__proto__ || Object.getPrototypeOf(Enhancer.prototype), 'componentWillUnmount', this)) _get(Enhancer.prototype.__proto__ || Object.getPrototypeOf(Enhancer.prototype), 'componentWillUnmount', this).call(this);

          window.removeEventListener('resize', this.privateHandleSizeMayHaveChanged.bind(this));
        }
      }, {
        key: 'privateHandleSizeMayHaveChanged',
        value: function privateHandleSizeMayHaveChanged() {
          var id = this.props.id;

          if (!this.comp) return;

          var _comp2 = this.comp,
              clientHeight = _comp2.clientHeight,
              clientWidth = _comp2.clientWidth,
              scrollHeight = _comp2.scrollHeight,
              scrollWidth = _comp2.scrollWidth;

          // Detect if the size changed (avoid unnecessary calls)

          if (clientWidth !== this.clientWidth || clientHeight !== this.clientHeight || scrollHeight !== this.scrollHeight || scrollWidth !== this.scrollWidth) {
            sizeChange(id, { clientHeight: clientHeight, clientWidth: clientWidth, scrollHeight: scrollHeight, scrollWidth: scrollWidth });
            this.privateRegisterComponentInfos();
          }
        }
      }, {
        key: 'privateRegisterComponentInfos',
        value: function privateRegisterComponentInfos() {
          if (!this.comp) return;
          var _comp3 = this.comp,
              clientHeight = _comp3.clientHeight,
              clientWidth = _comp3.clientWidth,
              scrollHeight = _comp3.scrollHeight,
              scrollWidth = _comp3.scrollWidth;

          // Register the height & width so we can compare them in the future

          this.clientHeight = clientHeight;
          this.clientWidth = clientWidth;
          this.scrollHeight = scrollHeight;
          this.scrollWidth = scrollWidth;
        }
      }, {
        key: 'render',
        value: function render() {
          var _this3 = this;

          // Retrieve the component render tree
          if (!_get(Enhancer.prototype.__proto__ || Object.getPrototypeOf(Enhancer.prototype), 'render', this)) return null;
          var elementsTree = _get(Enhancer.prototype.__proto__ || Object.getPrototypeOf(Enhancer.prototype), 'render', this).call(this);

          var newProps = {};
          if (elementsTree) {
            // Here thanks to II, we can add a ref without the subComponent noticing
            newProps = { ref: function ref(comp) {
                // Register the component to retrieve the DOM element
                _this3.comp = comp;
                // Call the element ref when there is one
                if (elementsTree.props.ref) elementsTree.props.ref();
              } };
          }

          // Create a new component from SubComponent render with new props
          var newElementsTree = _react2.default.cloneElement(elementsTree, newProps, elementsTree.props.children);
          return newElementsTree;
        }
      }]);

      return Enhancer;
    }(ComposedComponent);

    Enhancer.displayName = 'SizeFetcher(' + getDisplayName(SubComponent) + ')';
    Enhancer.propTypes = {
      id: _propTypes2.default.any.isRequired
    };

    return Enhancer;
  };
};

exports.default = SizeFetcher;