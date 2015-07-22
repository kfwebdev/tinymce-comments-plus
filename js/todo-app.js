'use strict';

var TodoList = React.createClass({
    displayName: 'TodoList',

    render: function render() {
        var createItem = function createItem(itemText) {
            return React.createElement(
                'li',
                null,
                itemText
            );
        };
        return React.createElement(
            'ul',
            null,
            this.props.items.map(createItem)
        );
    }
});

var TodoApp = React.createClass({
    displayName: 'TodoApp',

    getInitialState: function getInitialState() {
        return { items: [], text: '' };
    },

    onChange: function onChange(e) {
        this.setState({ text: e.target.value });
    },

    handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        var nextItems = this.state.items.concat([this.state.text]);
        var nextText = '';
        this.setState({ items: nextItems, text: nextText });
    },

    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'h3',
                null,
                'TODO'
            ),
            React.createElement(TodoList, { items: this.state.items }),
            React.createElement(
                'form',
                { onSubmit: this.handleSubmit },
                React.createElement('input', { onChange: this.onChange, value: this.state.text }),
                React.createElement(
                    'button',
                    null,
                    'Add #' + (this.state.items.length + 1)
                )
            )
        );
    }
});

React.render(React.createElement(TodoApp, null), document.getElementById('todoExample'));