'use strict';
import React from 'react';

var
  $ = jQuery
;

var spinner = {};
spinner.cSpeed=9;
spinner.cWidth=16;
spinner.cHeight=16;
spinner.cTotalFrames=22;
spinner.cFrameWidth=16;
spinner.cImageSrc='images/sprites.png';

spinner.cImageTimeout=false;
spinner.cIndex=0;
spinner.cXpos=0;
spinner.cPreloaderTimeout=false;
spinner.SECONDS_BETWEEN_FRAMES=0;

spinner.startAnimation = function(){

  document.getElementById('loaderImage').style.backgroundImage='url('+spinner.cImageSrc+')';
  document.getElementById('loaderImage').style.width=spinner.cWidth+'px';
  document.getElementById('loaderImage').style.height=spinner.cHeight+'px';

  //FPS = Math.round(100/(maxSpeed+2-speed));
  spinner.FPS = Math.round(100/spinner.cSpeed);
  spinner.SECONDS_BETWEEN_FRAMES = 1 / spinner.FPS;

  cPreloaderTimeout=setTimeout('continueAnimation()', spinner.SECONDS_BETWEEN_FRAMES/1000);

};

spinner.continueAnimation = function(){

  spinner.cXpos += spinner.cFrameWidth;
  //increase the index so we know which frame of our animation we are currently on
  spinner.cIndex += 1;

  //if our cIndex is higher than our total number of frames, we're at the end and should restart
  if (spinner.cIndex >= spinner.cTotalFrames) {
    spinner.cXpos =0;
    spinner.cIndex=0;
  }

  if(document.getElementById('loaderImage'))
    document.getElementById('loaderImage').style.backgroundPosition=(-spinner.cXpos)+'px 0';

  spinner.cPreloaderTimeout=setTimeout('continueAnimation()', spinner.SECONDS_BETWEEN_FRAMES*1000);
}

spinner.stopAnimation = function(){ //stops animation
  clearTimeout(spinner.cPreloaderTimeout);
  spinner.cPreloaderTimeout=false;
}

spinner.imageLoader = function(s, fun)//Pre-loads the sprites image
{
  clearTimeout(spinner.cImageTimeout);
  spinner.cImageTimeout=0;
  spinner.genImage = new Image();
  spinner.genImage.onload=function (){spinner.cImageTimeout=setTimeout(fun, 0)};
  spinner.genImage.onerror=new Function('alert(\'Could not load the image\')');
  spinner.genImage.src=s;
}

//The following code starts the animation
new spinner.imageLoader(spinner.cImageSrc, 'spinner.startAnimation()');

class EditComponent extends React.Component {
   constructor() {
    super();
    this._bind( [ 'editClick' ] );
    this.state = {
       hideEdit: false
    };

   }

   _bind( methods ) {
      methods.forEach( ( method ) => this[ method ] = this[ method ].bind( this ) );
   }

   componentDidMount() {
     let that = this;
     $( window ).on( 'toggleEdit', function( event ) {
        that.toggleEdit( event.editId );
     });
   }

   toggleEdit( editId ) {
      if ( this.props.editId === editId ) {
        this.setState({ hideEdit: !this.state.hideEdit });

        $( '#' + this.props.editId )
        .parent()
        .siblings()
        .toggle();
      }
   }

   editClick( event ) {
      event.preventDefault();
      $( window ).trigger({
        type: 'toggleEditor',
        editorId: this.props.editorId
      });
   }

    render() {
        return(
                <a href="javascript:void(0);" className={
                    this.props.tcpGlobals.tcp_css_button + ' ' +
                    this.props.tcpGlobals.tcp_css_edit_button + ' ' +
                    this.props.tcpGlobals.tcp_css_button_custom + ' ' +
                    this.props.tcpGlobals.tcp_css_edit_button_custom } id={ this.props.editId } onClick={ this.editClick } style={ this.state.hideEdit ? { display:'none' }:{ display:'inline-block' } }>Edit</a>
        );
    }
}

module.exports = EditComponent;
