'use strict';
import React from 'react';

var
  $ = jQuery,
  spinner = {}
;

window.spinner = spinner;

spinner.cSpeed=9;
spinner.cWidth=16;
spinner.cHeight=16;
spinner.cTotalFrames=22;
spinner.cFrameWidth=16;
spinner.cImageSrc='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWAAAAAQCAYAAAAoNKU5AAADH0lEQVR4nO3csWtTQRzA8S8hhOCUoQQpUkqRogVLBimlQykiIqiba8FJHPwDnFycnUPI4ODf4GjFVVxcLB1aW7cuDl3E1hKHu2teX/KS9+7Xl/fu+Ts4kl5/n0fT3O+XNL07GG11oAW0gXnb23asPiZ+mv8D7AJdoKNefc6+Y2N3rZX6rPNfvXpv32JYdJN6K6MfRPo58FDoe0BTfeV8E3gN3BD4no0ZJHQfH388L4U+KX/Uh+0B7kr8XCyoAdRsb3A5ueYy+DlgC+gDn4T+zD6oz4wmgfpwfdOODYA3Qn9mY7eslfro/H8u9En5oz5sD8P5/97Hu29et8FJrWFj4pU8rW8K/TpwjPlF9dRXxvfs2LGNKatfE/qk/FEfthfVzzrDyjwJRy/i4usF+HXMq9Q5sCz0HfViPw8sCnzH3j9j8uSvinfzfwHz2aCvd/mjXuaXrPX10vp3Ub0nfbYRb1FThH8B3Bf4PuYVr6te7LuYdw5PBX5gx/4X/xg4Evjoc6Ze5lvABvBM4CX17+K/zWmqt2uuircD9ZuYJ21Pvdjv2fub6mfmo/NfvcwXWr/cW2iAvxku4GLrY8ZC8N/t7SJ+j1/90MfH1Ofvo/PfXUO9n4+PzdTXMiBt1W46F8JpbnWStsBbjfHVfFqLvmsK0Z8At4FHnn7F3h5WwPeBfcznYD7+MDamPn+/AfwA3nn6aP6E7p8AdzA57eMLrV814NR+cS3DBVzsacD+BPjq6bft7U4F/E/M8sDt5PCJfic2pn42vg4cePpo/oTuvwC/CK/+OB/cMrSi/RrlWgYm9aEt41Iv803KtQxM6kOrHyPL0GB2GzGq4FeBb5RrI0MLuGd/rjJvZFBfvN/HLBks00aGHmZZ3gblz/88PJDfVuQq+gXSb8Wt2bGsW3mXSb+VFuAD+WzFVV89/5HLbZpfJftW3iXS518TuEU4+Z+Hh1hQUp+04Fj9eLOC+TMry2E2R5gJHe1FHEajXv1vTEGdNP/j/gHlyb9QPHD1x1GqN/dfkf44xpuYBebuOMU9sh+nqF79Vfo10h/H+Jby5V8p/T8JW/ooQGkj3AAAAABJRU5ErkJggg==';

spinner.cImageTimeout=false;
spinner.cIndex=0;
spinner.cXpos=0;
spinner.cPreloaderTimeout=false;
spinner.SECONDS_BETWEEN_FRAMES=0;

spinner.startAnimation = function( elementName ){
  document.getElementById( elementName ).style.backgroundImage = 'url(' + spinner.cImageSrc + ')';
  document.getElementById( elementName ).style.width = spinner.cWidth + 'px';
  document.getElementById( elementName ).style.height = spinner.cHeight + 'px';

  //FPS = Math.round(100/(maxSpeed+2-speed));
  spinner.FPS = Math.round( 100 / spinner.cSpeed );
  spinner.SECONDS_BETWEEN_FRAMES = 1 / spinner.FPS;

  spinner.cPreloaderTimeout = setTimeout( function() { spinner.continueAnimation( elementName ) }, spinner.SECONDS_BETWEEN_FRAMES / 1000 );

};

spinner.continueAnimation = function( elementName ){
  spinner.cXpos += spinner.cFrameWidth;
  //increase the index so we know which frame of our animation we are currently on
  spinner.cIndex += 1;

  //if our cIndex is higher than our total number of frames, we're at the end and should restart
  if (spinner.cIndex >= spinner.cTotalFrames) {
    spinner.cXpos =0;
    spinner.cIndex=0;
  }

  if ( document.getElementById( elementName ) ) {
     document.getElementById( elementName ).style.backgroundPosition = ( - spinner.cXpos ) + 'px 0';
  }

  spinner.cPreloaderTimeout = setTimeout( function() { spinner.continueAnimation( elementName ) }, spinner.SECONDS_BETWEEN_FRAMES * 1000 );
}

spinner.stopAnimation = function(){ //stops animation
  clearTimeout( spinner.cPreloaderTimeout );
  spinner.cPreloaderTimeout = false;
}

spinner.imageLoader = function( s, fun )//Pre-loads the sprites image
{
  clearTimeout( spinner.cImageTimeout );
  spinner.cImageTimeout = 0;
  spinner.genImage = new Image();
  spinner.genImage.onload = function (){ spinner.cImageTimeout = setTimeout( function() { fun }, 0 ) };
  spinner.genImage.setAttribute( 'src', s );
}

spinner.initSpinner = function( elementName ) {
  //The following code starts the animation
  new spinner.imageLoader( spinner.cImageSrc, spinner.startAnimation( elementName ) );
}

class SpinnerComponent extends React.Component {

   constructor() {
    super();
    this._bind( [ ] );
   }

   _bind( methods ) {
      methods.forEach( ( method ) => this[ method ] = this[ method ].bind( this ) );
   }

   componentDidMount() {
     let that = this;
     spinner.initSpinner( this.props.spinnerId );
   }

    render() {
        return(
                <div className="spinner" id={ this.props.spinnerId }  style={ this.props.showSpinner ? { display:'inline-block' }:{ display:'none' } }></div>
        );
    }
}

module.exports = SpinnerComponent;
