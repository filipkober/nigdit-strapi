"use strict";

/**
 * post controller
 * fr?
 */

import { Strapi } from "@strapi/types";
import { Params } from "@strapi/types/dist/modules/entity-service";
import { WildcardNotation } from "@strapi/types/dist/modules/entity-service/params/fields";
import { sanitize } from "@strapi/utils";
const { createCoreController } = require("@strapi/strapi").factories;

const feedQuery: Params.Pick<"api::post.post", 'fields' | 'filters' | '_q' | 'pagination:offset' | 'sort' | 'populate' | 'publicationState' | 'plugin' > = {
  fields: "*" as WildcardNotation,
  populate: {
    owner: {
      fields: ["username"],
    },
    media: {
      populate: "*",
    },
    subnigdit: {
      fields: ["name", "description","name_uid"],
      populate: {
        // @ts-ignore
        subscribers: { count: true },
        icon: {
          // fields: "*",
          // populate: "*",
          fields: ["url"],
          populate: "url",
        },
      },
    },
    comments: { count: true },
  },
};

module.exports = createCoreController("api::post.post", ({ strapi }: {strapi: Strapi}) => {
  return {
    async delete(ctx) {
      const post = await strapi.entityService.findOne(
        "api::post.post",
        ctx.params.id,
        {
          populate: "*",
        }
      );

      const mediaId = post.media?.id;
      if (mediaId) {
        const file = await strapi.plugins.upload.services.upload.findOne(
          mediaId
        );
        await strapi.plugins.upload.services.upload.remove(file);
      }

      const newPost = await strapi.entityService.update(
        "api::post.post",
        ctx.params.id,
        {
          data: {
            title: "[removed]",
            description: "[removed]",
            type: "Text",
          },
        }
      );

      ctx.send(newPost, 200);
    },
    async upVote(ctx) {
      const user = ctx.state.user;
      const id = ctx.params.id;
      const clonedVotes = JSON.parse(JSON.stringify(user.votes));
      const post = await strapi.entityService.findOne("api::post.post", id);
      if (!post) return ctx.send("Post not found", 404);
      let postVotes = Number(post.votes);
      if (clonedVotes.upvotes.posts.includes(id)) {
        clonedVotes.upvotes.posts = clonedVotes.upvotes.posts.filter(
          (postId) => postId != id
        );
        postVotes--;
      } else if (clonedVotes.downvotes.posts.includes(id)) {
        clonedVotes.downvotes.posts = clonedVotes.downvotes.posts.filter(
          (postId) => postId != id
        );
        clonedVotes.upvotes.posts.push(id);
        postVotes += 2;
      } else {
        clonedVotes.upvotes.posts.push(id);
        postVotes++;
      }
      await strapi.entityService.update("api::post.post", id, {
        data: {
          votes: postVotes,
        },
      });

      const updatedUser = await strapi.entityService.update(
        "plugin::users-permissions.user",
        user.id,
        {
          data: {
            votes: clonedVotes,
          },
        }
      );
      ctx.send(updatedUser.votes, 200);
    },
    async downVote(ctx) {
      const user = ctx.state.user;
      const id = ctx.params.id;
      const clonedVotes = JSON.parse(JSON.stringify(user.votes));
      const post = await strapi.entityService.findOne("api::post.post", id);
      if (!post) return ctx.send("Post not found", 404);
      let postVotes = Number(post.votes);
      if (clonedVotes.downvotes.posts.includes(id)) {
        clonedVotes.downvotes.posts = clonedVotes.downvotes.posts.filter(
          (postId) => postId != id
        );
        postVotes++;
      } else if (clonedVotes.upvotes.posts.includes(id)) {
        clonedVotes.upvotes.posts = clonedVotes.upvotes.posts.filter(
          (postId) => postId != id
        );
        clonedVotes.downvotes.posts.push(id);
        postVotes -= 2;
      } else {
        clonedVotes.downvotes.posts.push(id);
        postVotes--;
      }

      await strapi.entityService.update("api::post.post", id, {
        data: {
          votes: postVotes,
        },
      });

      const updatedUser = await strapi.entityService.update(
        "plugin::users-permissions.user",
        user.id,
        {
          data: {
            votes: clonedVotes,
          },
        }
      );
      ctx.send(updatedUser.votes, 200);
    },

    //FEED ALGORITHMS

    
    async getNew(ctx)
    {
      let posts = null;
      let filters = {}
      const subnigditFeedId = ctx.query.subnigdit;
      const start = parseInt(ctx.query.start) || 0;
      const limit = parseInt(ctx.query.limit) || 10;
      const mode = parseInt(ctx.query.mode) || 0; //0-normal 1-subscribed 2-myposts
      const userId = ctx.state.user? ctx.state.user.id : null;
      console.log("start: "+start+" limit: "+limit+" mode: "+mode+" userId: "+userId)
      if(subnigditFeedId && mode != 1) // specified subnigdit id or array of ids
      {
          filters = { ...filters, subnigdit: subnigditFeedId}
      }
      if (mode == 1) //posts from subscribed subnigdits
      {
        const userSubnigdits = await strapi.entityService.findMany(
          "api::subnigdit.subnigdit",
          { filters: { subscribers: userId }, populate: "*" }
        );
        const userSubnigditsIds = userSubnigdits.map((group) => group.id);
        filters = { ...filters, subnigdit: userId ? userSubnigditsIds : []}
      }
      else if(mode == 2) //my posts
      {
        filters = { ...filters, owner: userId}
      }
      console.log(filters)
      posts = await strapi.entityService.findMany("api::post.post", {
        filters: filters,
        ...feedQuery,
      });
      posts.sort((a, b) => a.createdAt - b.createdAt);
      posts.reverse();
      const startIndex = start < 0 ? 0 : start;
      const endIndex = Math.min(startIndex + limit, posts.length);
      const data = posts.slice(startIndex, endIndex);
      ctx.send({ data: data }, 200);
    },
    async getTop(ctx)
    {
      let posts = null;
      let filters = {}
      const subnigditFeedId = ctx.query.subnigdit;
      const start = parseInt(ctx.query.start) || 0;
      const limit = parseInt(ctx.query.limit) || 10;
      const mode = parseInt(ctx.query.mode) || 0;
      const userId = ctx.state.user? ctx.state.user.id : null;
      if(subnigditFeedId && mode != 1)
      {
          filters = { ...filters, subnigdit: subnigditFeedId}
      }
      if (mode == 1)
      {
        const userSubnigdits = await strapi.entityService.findMany(
          "api::subnigdit.subnigdit",
          { filters: { subscribers: userId }, populate: "*" }
        );
        const userSubnigditsIds = userSubnigdits.map((group) => group.id);
        filters = { ...filters, subnigdit: userId ? userSubnigditsIds : []}
      }
      else if(mode == 2)
      {
        filters = { ...filters, owner: userId}
      }
      posts = await strapi.entityService.findMany("api::post.post", {
        filters: filters,
        ...feedQuery,
      });
      var i = -1;
      const samples = posts.map((post) => {
        i += 1;
        return {
          idPostu: post.id,
          pozycja: i,
          popularity: parseInt(post.votes),
        };
      });
      samples.sort((a, b) => b.popularity - a.popularity);
      const sorted = samples.map((sample) => {
        return posts[sample.pozycja];
      });
      const startIndex = start < 0 ? 0 : start;
      const endIndex = Math.min(startIndex + limit, sorted.length);
      const data = sorted.slice(startIndex, endIndex);
      ctx.send({ data: data }, 200);
    },
    async getHot(ctx)
    {
      let posts = null;
      let filters = {}
      const subnigditFeedId = ctx.query.subnigdit;
      const start = parseInt(ctx.query.start) || 0;
      const limit = parseInt(ctx.query.limit) || 10;
      const mode = parseInt(ctx.query.mode) || 0;
      const userId = ctx.state.user? ctx.state.user.id : null;
      if(subnigditFeedId && mode != 1)
      {
          filters = { ...filters, subnigdit: subnigditFeedId}
      }
      if (mode == 1)
      {
        const userSubnigdits = await strapi.entityService.findMany(
          "api::subnigdit.subnigdit",
          { filters: { subscribers: userId }, populate: "*" }
        );
        const userSubnigditsIds = userSubnigdits.map((group) => group.id);
        filters = { ...filters, subnigdit: userId ? userSubnigditsIds : []}
      }
      else if(mode == 2)
      {
        filters = { ...filters, owner: userId}
      }
      posts = await strapi.entityService.findMany("api::post.post", {
        filters: filters,
        ...feedQuery,
      });
      var i = -1;
      const samples = posts.map((post) => {
        i += 1;
        var dataPosta = new Date(post.createdAt);
        var today = new Date();
        var differenceInMs = today.getTime() - dataPosta.getTime();
        var differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
        if (differenceInDays < 0)
        {
          differenceInDays = 4202137;
        }
        return {
          idPostu: post.id,
          pozycja: i,
          popularity: (post.comments.count * 3 + parseInt(post.votes))*2 / (differenceInDays+1),
          votes: post.votes,
          dif: differenceInDays
        };
      });
      samples.sort((a, b) => b.popularity - a.popularity);
      const sorted = samples.map((sample) => {
        // console.log("id: "+sample.idPostu+" pop: "+sample.popularity+" votes: "+sample.votes+" posted "+sample.dif+" days ago")
        return posts[sample.pozycja];
      });
      const startIndex = start < 0 ? 0 : start;
      const endIndex = Math.min(startIndex + limit, sorted.length);
      const data = sorted.slice(startIndex, endIndex);
      ctx.send({ data: data }, 200);
    },

    async create(ctx) {
      const { user } = ctx.state;
      const { title, subnigdit, nsfw, type } = ctx.request.body;
      let post;
      if (type === "Text") {
        const { description } = ctx.request.body;
        post = await strapi.entityService.create("api::post.post", {
          data: {
            title,
            description,
            subnigdit,
            nsfw,
            type,
            owner: user.id,
          },
          populate: "*",
        });
      } else {
        post = await strapi.entityService.create("api::post.post", {
          data: {
            title,
            subnigdit,
            nsfw,
            type,
            owner: user.id,
          },
          files: {
            media: ctx.request.files["files.media"],
          },
          populate: "*",
        });
      }
      const schema = strapi.getModel("api::post.post");
      const sanitizedEntity = await sanitize.contentAPI.output(post, schema) as any;
      delete sanitizedEntity.owner.password;
      delete sanitizedEntity.owner.email;
      delete sanitizedEntity.owner.resetPasswordToken;
      delete sanitizedEntity.owner.confirmationToken;
      delete sanitizedEntity.owner.provider;
      delete sanitizedEntity.createdBy;
      delete sanitizedEntity.updatedBy;
      return ctx.send({ data: sanitizedEntity }, 200);
    },
    async banAuthor(ctx) {
      const { user } = ctx.state;
      const { id } = ctx.params;

      const post = await strapi.entityService.findOne(
        "api::post.post",
        id,
        {populate: '*'}
      );
      if (!post) return ctx.send("Post not found", 404);
      const author = post.owner;
      const clonedBans = JSON.parse(JSON.stringify(author.bans));
      if (!clonedBans.includes(post.subnigdit.id)) {
        clonedBans.push(post.subnigdit.id);
      }
      const updatedUser = await strapi.entityService.update(
        "plugin::users-permissions.user",
        author.id,
        {
          data: {
            bans: clonedBans,
          },
        }
      );
      const removedPost = await strapi.service("api::post.post").removePostValues(post);
      ctx.send(removedPost, 200);
    }
  };
});
