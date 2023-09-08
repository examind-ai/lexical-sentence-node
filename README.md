# React Lexical Sentence

Lexical doesn't come with the concept of sentences. For essay progress tracking, granularity at the sentence level is desired, so this repo creates a custom SentenceNode to track sentence changes.

## Status

Put this custom `SentenceNode` approach on hold based on inherent challenges with getting Lexical to play nicely with custom nested structures. More info:

Challenges explained: https://discord.com/channels/953974421008293909/953974421486436393/1149744521534513253
Another developer trying to create the same SentenceNode and running into similar issues: https://discord.com/channels/953974421008293909/955972012541628456/1037712450511970304

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

### Join sentences when period is removed

Sentences don't join when periods are removed.

<video src="assets/join_sentences.mp4" controls title="Title"></video>

https://github.com/examind-ai/lexical-sentence-node/assets/504505/0a290bdc-0816-47b6-96fb-da2f9ef3070b
