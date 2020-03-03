// Get block name from the class.
const REGEX = /(?<=wp-block-).[^_\s]*/g;
const IGNORED_BLOCKS = [ 'columns', 'column' ];

function hasOverlay( block ) {
    return block.classList.contains('has-detected') || block.parentNode.classList.contains('has-detected');
}

function injectStyles() {
    if ( document.getElementById('detective-wapuu-styles') ) {
        return;
    }

    const styles = `
        .has-detected {
            position: relative;
        }
        .detective-wapuu-overlay {
            position: absolute;
            top: 0;
            left: 0;
            color: #fff;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
        }
    `;

    styleEl = document.createElement('style');
    styleEl.setAttribute('id', 'detective-wapuu-styles');

    document.body.appendChild(styleEl);
    styleEl.appendChild(document.createTextNode(styles));
}

function injectOverlay( name, block ) {
    const overlay = document.createElement('div');
    overlay.classList.add('detective-wapuu-overlay');
    overlay.innerText = name;

    block.classList.add('has-detected');
    block.appendChild(overlay);
}

// Detect blocks on page load.
document.addEventListener( 'DOMContentLoaded', () => {
    const blocks = document.querySelectorAll('[class^="wp-block"]');

    if ( blocks.length ) {
        chrome.runtime.sendMessage({ "message": "has_blocks" });
    }
} );

chrome.runtime.onMessage.addListener( ( request ) => {
    if ( request.message === "scan_blocks" ) {
        const blocks = document.querySelectorAll('[class^="wp-block"]');

        if ( ! blocks.length ) {
            console.log('No blocks 😔');
            return;
        }

        injectStyles();

        blocks.forEach( ( block ) => {
            const [ name ] = block.classList.value.match( REGEX ) || [];

            if ( IGNORED_BLOCKS.includes( name ) ) {
                return;
            }

            if ( name && ! hasOverlay( block ) ) {
                injectOverlay( name, block );
            }
        } );
    }
});
