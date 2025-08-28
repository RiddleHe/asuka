const terminal = {
    input: document.getElementById('terminal-input'),
    output: document.getElementById('output'),
    mediaOverlay: document.getElementById('media-overlay'),
    media: {
        audio: 'media/clock_strikes.mp3',
        photo: 'media/thrift_shop.png',
        text: `本多以为清显肯定会把心中的什么秘密告诉自己，但他又不能承认自己是在作这种等待。
同时也半是希望最好清显什么也别对自己说。
他难以承受朋友这种如恩赐般地把秘密告诉自己。
于是，本多不由自主地主动开口，绕着弯子说： 
“最近这一段时间，我一直在思考个性这个问题。
我认为自己至少在这个时代、这个社会、这个学校里是一个与众不同的人，也愿意这么认为。
你也是这样的吧？” “那是啊。” 
在这个时候，清显回答的声音更显出不情愿的无精打采，散发着独特的幼稚气息。 
“可是，你想一想百年以后，不管我们是否愿意，恐怕都要卷进一个时代的思潮，任人观察。
美术史各个时代的不同风格，就无可辩驳地证明了这一点。
当我们生活在一个时代模式里的时候，谁也无法不通过这个模式认识事物。” 
“可是，现在的时代有模式吗？” 
“你是想说明治时代的模式正在死亡吧？
但是，生活在模式里的人们绝对看不见这个模式，
所以我们也肯定被某种模式包围着，正如金鱼不知道自己生活在金鱼缸里一样。 
“你只生活在感情的世界里。在别人眼里，你是个古怪的人。
大概你也认为自己忠实地生活在个性里吧。
但是，没有任何东西可以证明你的个性。
同时代人的证言没有一句是可信的。
也许你的感情世界本身显示出时代模式的最纯粹的形式……
不过，也没有任何东西可以证明。” 
“那么，什么东西才能证明呢？” 
“时间。只能是时间。
时间的流逝把你我都囊括其中，无情地提取出我们没有觉察出来的时代共性……
然后以‘大正时代的青年原来是这样思考、穿着这样的衣服、以这种方式说话’的形式把我们大家统统概括起来。
你不喜欢剑道部那些人吧？对他们充满蔑视的情绪吧？” 
“嗯。” 
冷气透过裤子逐渐侵袭上来，清显坐得很不自在，眼睛却看着亭子栏杆旁边的一棵山茶树。
积雪滑落下来以后的树叶闪烁着鲜艳的亮光。`
    }
};

const commands = {
    help: {
        description: 'Show available commands',
        execute: () => {
            return `
<table class='help-table'>
    <tr><td>help</td><td>Show this help message</td></tr>
    <tr><td>read</td><td>Read your favoirte book</td></tr>
    <tr><td>listen</td><td>Listen to your favorite song</td></tr>
    <tr><td>dream</td><td>Dream ~ ~</td></tr>
    <tr><td>clear</td><td>Clear the terminal</td></tr>
</table>`;
        }
    },

    read: {
        description: 'Display text',
        execute: () => {
            setTimeout(() => showMedia('text', terminal.media.text), 300);
            return '<span class="success-message">Opening book...</span>';
        }
    },

    listen: {
        description: 'Play audio',
        execute: () => {
            setTimeout(() =>showMedia('audio', terminal.media.audio), 300);
            return '<span class="success-message">Starting song...</span>';
        }
    },

    dream: {
        description: 'Show photo',
        execute: () => {
            setTimeout(() => showMedia('photo', terminal.media.photo), 300);
            return '<span class="success-message">Loading dream...</span>';
        }
    },

    clear: {
        description: 'Clear terminal',
        execute: () => {
            const welcomeMessage = terminal.output.querySelector('.welcome-message');
            terminal.output.innerHTML = '';
            if (welcomeMessage) {
                terminal.output.appendChild(welcomeMessage.cloneNode(true));
            }
            return null;
        }
    },

};

function init() {
    terminal.input.addEventListener('keydown', handleInput);
    document.getElementById('close-media').addEventListener('click', closeMedia);
    document.addEventListener('keydown', handleGlobalKeys);

    document.querySelector('.terminal-body').addEventListener('click', () => {
        terminal.input.focus();
    });

    updateCursor();
    terminal.input.addEventListener('input', updateCursor);
}

function handleInput(e) {
    switch (e.key) {
        case 'Enter':
            e.preventDefault();
            processCommand();
            break;
    }
}

function processCommand() {
    const input = terminal.input.value.trim();
    if (!input) return;

    addToOutput(`<div class="terminal-input-line">
        <span class="prompt">muyuxi@home:~$ </span>
        <span>${escapeHtml(input)}</span>
    </div>`);

    const [cmd, ...args] = input.toLowerCase().split(' ');
    
    if (commands[cmd]) {
        const result = commands[cmd].execute(args);
        if (result) {
            addToOutput(`<div class="command-output">${result}</div>`);
        }
    } else {
        addToOutput(`<div class="command-output error-message">
            Command not found: ${escapeHtml(cmd)}
            Type 'help' for available commands.
        </div>`)
    }

    terminal.input.value = '';
    updateCursor();

    // scroll terminal body not output
    document.querySelector('.terminal-body').scrollTop = document.querySelector('.terminal-body').scrollHeight;
}

function addToOutput(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    terminal.output.appendChild(div);
}

function showMedia(type, source) {
    const overlay = terminal.mediaOverlay;
    overlay.classList.remove('hidden');

    document.querySelectorAll('.media-element').forEach(el => {
        el.classList.add('hidden');
    });

    const audio = document.getElementById('audio-player');
    const audioContainer = document.getElementById('audio-container');

    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
        audio.load();
    }

    if (audioContainer) {
        audioContainer.style.display = 'none'; // force the browser to hide
    }

    switch (type) { 
        case 'audio':
            const audioContainer = document.getElementById('audio-container');
            audio.src = source;
            audioContainer.style.display = 'flex';
            audioContainer.classList.remove('hidden');
            audio.load();
            audio.play();
            break;
        
        case 'photo':
            const img = document.getElementById('image-viewer');
            img.src = source;
            img.classList.remove('hidden');
            break;

        case 'text':
            const textReader = document.getElementById('text-reader');
            const textContent = document.getElementById('text-content');
            textContent.innerHTML = typewriterEffect(source);
            textReader.classList.remove('hidden');
            break;
    }
}

function closeMedia() {
    terminal.mediaOverlay.classList.add('hidden');

    const audio = document.getElementById('audio-player');

    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}

function handleGlobalKeys(e) {
    if (!terminal.mediaOverlay.classList.contains('hidden')) {
        switch (e.key) {
            case 'Escape':
                closeMedia();
                break;
            case ' ':
                e.preventDefault();
                const audio = document.getElementById('audio-player');
                if (audio && audio.src) {
                    if (audio.paused) { 
                        audio.play(); // control play only if pause
                    } else { 
                        audio.pause(); // control pause only if play 
                    }
                }
                break;
        }
    }
}

function updateCursor() {
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        const inputRect = terminal.input.getBoundingClientRect();
        const textWidth = getTextWidth(terminal.input.value, window.getComputedStyle(terminal.input));
        cursor.style.marginLeft = `${textWidth +2}px`;
    }
}

function getTextWidth(text, style) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = style.fontSize + ' ' + style.fontFamily;
    return context.measureText(text).width;
}

function typewriterEffect(text) {
    return text.split('\n').map((line, i) => 
        `<div>${escapeHtml(line)}</div>`).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});

window.addEventListener('resize', () => {
    const canvas = document.getElementById('particles-bg');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});