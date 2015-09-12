var DietQuery = React.createClass({
  render: function() {
    return (
      <div className="dietry-query">
        <img id="vegetarian" src="../assets/allergyIcons/vegetarian.png" onClick={this.props.selectDiet.bind(this.props.ctx, 'vegetarian')}/>
        <img id="vegan" src="../assets/allergyIcons/vegan.png"  onClick={this.props.selectDiet.bind(this.props.ctx, 'vegan')}/>
        <img id="lactosefree" src="../assets/allergyIcons/lactosefree.png" onClick={this.props.selectDiet.bind(this.props.ctx, 'lactosefree')}/>
        <img id="glutenfree" src="../assets/allergyIcons/glutenfree.png" onClick={this.props.selectDiet.bind(this.props.ctx, 'glutenfree')}/>
      </div>
    );
  }
});

module.exports = DietQuery;