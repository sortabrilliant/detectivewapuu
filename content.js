// Get block name from the class.
const REGEX = /(?<=wp-block-).[^_\s]*/g;
const IGNORED_BLOCKS = [ 'columns', 'column', 'group', 'coblocks-row', 'coblocks-column' ];

function hasOverlay( block ) {
    return block.classList.contains('is-detected') || block.parentNode.classList.contains('is-detected');
}

function injectStyles() {
    if ( document.getElementById('detective-wapuu-styles') ) {
        return;
    }

    const styles = `
        .is-detected {
            position: relative;
        }
        .detective-wapuu-overlay {
            background-color: rgba(251, 93, 232, 0.15);
            border: 2px solid #FB5DE8;
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;
            z-index: 10;
        }
        .detective-wapuu-overlay__tab {
            background-color: #FB5DE8;
            color: #000;
            font-size: 11px;
            height: 22px;
            left: -2px;
            line-height: 22px;
            padding: 0px 8px;
            position: absolute;
            top: -22px;
        }
    `;

    styleEl = document.createElement('style');
    styleEl.setAttribute('id', 'detective-wapuu-styles');

    document.body.appendChild(styleEl);
    styleEl.appendChild(document.createTextNode(styles));
}

function injectOverlay( name, block ) {
    const overlay = document.createElement('div');
    const tab = document.createElement('span');

    overlay.classList.add('detective-wapuu-overlay');
    tab.classList.add('detective-wapuu-overlay__tab');

    overlay.appendChild(tab);
    tab.innerText = name;

    block.classList.add('is-detected');
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
