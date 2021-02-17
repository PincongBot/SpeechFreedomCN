// @ts-check
"use strict";

/** @type {any} */
const har = require("./har.json");
const fs = require("fs");

/**
 * @typedef {Object} Tweet
 * @property {string} created_at RFC 2822 date string
 * @property {string} id_str tweet id
 * @property {string} user_id_str user id
 * @property {string} conversation_id_str == tweet id ?
 * @property {string} full_text tweet contents
 * @property {[number, number]} display_text_range
 * @property {number} retweet_count
 * @property {number} favorite_count
 * @property {number} reply_count
 * @property {number} quote_count
 * @property {boolean} possibly_sensitive_editable
 * @property {string} lang ISO 639-1
 * @property {{ media: MediaEntity[]; hashtags?: Tag[]; }} entities
 * @property {{ media: MediaEntityExtended[]; hashtags?: Tag[]; }} extended_entities
 */

/** @type {Tweet[]} */
const entries = har.log.entries.map((x) => {
  const ts = JSON.parse(x.response.content.text).globalObjects.tweets;
  return Object.values(ts);
}).flat(2).sort((a, b) => +b.id_str - +a.id_str);

/** @type {{ [id: string]: Tweet; }} */
const tweets = {};
entries.forEach((t) => {
  delete t.display_text_range;
  delete t.extended_entities;

  delete t.retweet_count;
  delete t.favorite_count;
  delete t.reply_count;
  delete t.quote_count;

  delete t.conversation_id_str;
  delete t.possibly_sensitive_editable;

  tweets[t.id_str] = t;
});

fs.writeFileSync("tweets_archive.json", JSON.stringify(tweets, null, 4));


