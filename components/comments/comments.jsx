var Comments = React.createClass({
  render: function() {
    return (
      <div className="comments">
        So many cool comments!
      </div>
    );
  }
});

React.render(
  <Comments />,
  document.body
);
