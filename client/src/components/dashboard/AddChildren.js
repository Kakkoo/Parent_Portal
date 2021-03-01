import React, { Component } from 'react'
import childrenImg from '../../img/illustrations/undraw_children_4rtb.svg'

export default class AddChildren extends Component {
  render() {
    //if family does not have children added

    //if family has added children

    return (
      <div className="container">
        <h2 className="text-center display-4">Add a Child to Get Started!</h2>
        <div className="row col-10 mx-auto">
          <img src={childrenImg} className="col-6" />
          <div className="col-6">
          <form >
            <div className="row align-items-center justify-content-center mb-3">
              <div className="col-sm-3">
                <label className="visually-hidden" for="specificSizeInputName">Name</label>
                <input type="text" className="form-control" id="specificSizeInputName" placeholder="Jane Doe" />
              </div>
              <div className="col-sm-3">
                <label className="visually-hidden" for="specificSizeInputName">Name</label>
                <input type="text" className="form-control" id="specificSizeInputName" placeholder="Jane Doe" />
              </div>
              
              <div className="col-auto">
                <button className="btn btn-outline-custom p-2">Add More</button>
              </div>
            </div>
            <div className="row align-items-center justify-content-center">
               <button className="btn btn-custom text-white col-2 btn-lg">Submit</button>
            </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
