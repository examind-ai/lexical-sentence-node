# React Lexical Sentence

Create custom SentenceNode for Lexical.

## Setup

```
npm ci
```

## Run

```
npm run dev
```

## Problems

### ltr class and dir

Class `ltr` and dir `ltr` gets attached to `sentence` when rendered in the editor instead of `p`:

```
<p class="editor-paragraph">
  <sentence class="ltr" dir="ltr">
    <span data-lexical-text="true">test</span>
  </sentence>
</p>
```

Although noteworthy is when DOM gets exported, `ltr` dir is properly attached.

```
<p class="editor-paragraph" dir="ltr">
  <sentence>
    <span>test</span>
  </sentence>
</p>
```

### Backspace

When backspacing, sentences with no text don't get deleted.

<video src="assets/backspace.mp4" controls title="Title"></video>

### New character at beginning of sentence

Adding new character at the beginning of a sentence creates new sentence.

<video src="assets/beginning_sentence.mp4" controls title="Title"></video>
