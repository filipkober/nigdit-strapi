'use strict';

/**
 * subnigdit service
 */
import { Strapi } from '@strapi/strapi';
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::subnigdit.subnigdit', ({ strapi } : { strapi: Strapi }) => ({
    async isSubnigditAdmin(userId, subId){
        const subnigdit = await strapi.entityService.findOne("api::subnigdit.subnigdit", subId, {
            populate: "*",
        });
        if(!subnigdit) return false;
        if(subnigdit.owner.id === userId) return true;
        const admins = subnigdit.moderators.map(admin => admin.id);
        return admins.includes(userId);
    },
    async nukeSubnigdit(subId){
        const fullSubnigdit = await strapi.entityService.findOne("api::subnigdit.subnigdit", subId, {
            populate: {
                posts: {
                    fields: ['id'],
                    populate: {
                        media: {
                            populate: '*'
                        },
                        comments: {
                            fields: ['id'],
                            populate: {
                                replies: {
                                    fields: ['id'],
                                }
                            }
                        }
                    }
                },
                contentReports: {
                    fields: ['id'],
                }
            }
        });
        if(!fullSubnigdit) return;
        const posts = fullSubnigdit.posts.map(post => post.id);

        for(const post of fullSubnigdit.posts){
            if(post.media){
                const imageEntry = await strapi.db.query('plugin::upload.file').delete({
                    where: { id: post.media.id },
                });
                strapi.plugins.upload.services.upload.remove(imageEntry);
            }
        }

        const reports = fullSubnigdit.contentReports.map(report => report.id);

        const comments = fullSubnigdit.posts.map(post => post.comments.map(comment => comment.id)).flat();
        const replies = fullSubnigdit.posts.map(post => post.comments.map(comment => comment.replies.map(reply => reply.id))).flat(2);
        console.log(posts, comments, replies)
        await strapi.db.query('api::post.post').deleteMany({
            where: {
                id: {
                    $in: posts
                }
            }
        })
        await strapi.db.query('api::report.report').deleteMany({
            where: {
                id: {
                    $in: reports
                }
            }
        })
        await strapi.db.query('api::comment.comment').deleteMany({
            where: {
                id: {
                    $in: comments
                }
            }
        })
        await strapi.db.query('api::reply.reply').deleteMany({
            where: {
                id: {
                    $in: replies
                }
            }
        })

        await strapi.entityService.delete("api::subnigdit.subnigdit", subId);
    },
}));
