import React, {Component} from 'react';
import topNavbranding from '../../assets/images/854.jpg';
import { map as _map, get as _get, reduce as _reduce, isEmpty as _isEmpty } from 'lodash';

import {isMobile, isTablet} from 'react-device-detect';

import {
    
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Container, Row, Col
  } from 'reactstrap';




class MegaMenu extends Component {
  constructor(props){
    super(props);
  } 
  chunk = (array, size) => {
    if (!array) return [];
    const firstChunk = array.slice(0, size); // create the first chunk of the given array
    if (!firstChunk.length) {
      return array; // this is the base case to terminal the recursive
    }
    return [firstChunk].concat(this.chunk(array.slice(size, array.length), size)); 
  }

  menuList = ({ menu, categoryName }) => _map(menu, m => {
     
    return (
        <li onClick={(e) => { this.props.handleCategoryClick({ data: m, allData: this.props.category, categoryName, event: e })}} key={m.category_id.toString()}>
                <a href="javascript: void(0)">{m.category_name}</a>
        </li>
    )
  });
  clickFirstCategory = ({ categoryName, event, child }) => {
    // console.log('click first category');
    // const categoryName = this.props.category.child[0].category_name;
    // const categoryId = this.props.category.child[0].category_id;
    // this.props.history.push(`/store/category/${this.props.category.category_name}/${categoryName}/${categoryId}`)
    this.props.handleMenuToggle({ categoryName, event, child });
    this.props.history.push(`/store/category/${this.props.category.category_name}/${this.props.category.category_name}/${this.props.category.category_id}`)
    
  }
    render() {
       
        const finalChunk = this.chunk(_get(this.props, 'category.child', []), 5);
        
        const menu = _map(finalChunk, (val, index) => {
            let menuli = this.menuList({ menu: val, categoryName: this.props.category.category_name })
            return (
                <ul key={index.toString()}>
                    {menuli}
                </ul>
            );
        });
        return (
            <React.Fragment key={this.props.category.category_id.toString()}>
                <li className={`${this.props.states[`isshowHoverToggle${this.props.category.category_name}`]? 'show': ''}`} onMouseEnter={() => { !isMobile && this.props.onMouseEnter({category: this.props.category.category_name, child: this.props.category.child}) }} onMouseLeave={() => this.props.onMouseLeave({ category: this.props.category.category_name})} onClick={(e) => { this.props.dropdownToggle({ category: this.props.category.category_name, event: e })}}>
                    {this.props.category.category_name ? <a className={ _isEmpty(this.props.category.child)? 'no-after' : ''} href="javascript: void(0)" onClick={(e) => this.clickFirstCategory({categoryName: this.props.category.category_name, event: e, child: this.props.category.child})}>{this.props.category.category_name.toUpperCase()}</a>: null}
                    
                    {/* <a href="#">WINE</a>                                           */}
                    <div className="dropdownMenu" style={{display: `${this.props.states[`isshowHoverToggle${this.props.category.category_name}`]? '': 'none'}`}}>
                        <div className="fullWidthtopmenu">
                            <div className="menusColumn">
                                <h4>CATEGORIES</h4>
                                <div className="dropMenulist">                                    
                                    {menu}
                                </div>                                                       
                            </div>
                           { /*<div className="menusColumn">
                            <h4>FEATURES</h4>
                            <div className="dropMenulist">                                                           <ul>
                                    <li><a href="#">Party Essentials</a></li>
                                    <li><a href="#">Top Shelf Liquor</a></li>
                                </ul>                                                           
                                </div>
                            </div>
                            <div className="menusColumn d-none d-md-block">
                                <img src={topNavbranding} className="img-fluid" ></img>
        </div>*/ }

                        </div>
                    </div> 
                </li>

                    {/* <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                            {this.props.category.category_name && this.props.category.category_name.toUpperCase()}
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>
                            <div className="fullWidthtopmenu">
                            <div className="menusColumn">
                                <h4>CATEGORIES</h4>
                                <div className="dropMenulist">
                                   {menu}
                                </div>                                                       
                            </div>
                            <div className="menusColumn">
                            <h4>FEATURES</h4>
                            <div className="dropMenulist">                                                           
                                    <ul>
                                        <li><a href="#">Party Essentials</a></li>
                                        <li><a href="#">Top Shelf Liquor</a></li>
                                    </ul>                                                           
                                </div>
                            </div>
                            <div className="menusColumn">
                                <img src={topNavbranding} className="img-fluid" ></img>
                            </div>

                            </div>
                        </DropdownItem> 
                    </DropdownMenu>
                </UncontrolledDropdown> */}
               
            </React.Fragment>
        
        );
    }
}

export default MegaMenu;