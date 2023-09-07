# React Lexical Sentence

Lexical doesn't come with the concept of sentences. For essay progress tracking, granularity at the sentence level is desired, so this repo creates a custom SentenceNode to track sentence changes.

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

### New character at beginning of sentence

Adding new character at the beginning of a sentence creates new sentence.

<video src="assets/beginning_sentence.mp4" controls title="Title"></video>

https://github.com/examind-ai/lexical-sentence-node/assets/504505/25824202-bbb7-4762-aa59-06ba4d01b522
