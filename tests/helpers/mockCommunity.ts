import { makeUser } from "./mockUser";

export const examinCommunity = async () => {
    const posts = await strapi.entityService.findMany("api::post.post", { fields: ['title'], });
    let cube = false;
    posts.forEach((p) => {
        if(p.title == "The Cube")
        {
            cube = true;
        }
    })
    if(posts.length != 10 || !cube)
    {
        await nukeTheGlobe();
        await generateCommunity();
    }
}

export const nukeTheGlobe = async () => {
    const subnigditsToDelete = await strapi.entityService.findMany("api::subnigdit.subnigdit", { fields: ['name'], });
    await Promise.all(subnigditsToDelete.map(async (s) => {
        await strapi.entityService.delete("api::subnigdit.subnigdit", s.id);
    }));

    const postsToDelete = await strapi.entityService.findMany("api::post.post", { fields: ['title'], });
    await Promise.all(postsToDelete.map(async (s) => {
        await strapi.entityService.delete("api::post.post", s.id);
    }));

    const usersToDelete = await strapi.plugins['users-permissions'].services.user.fetchAll();
    await Promise.all(usersToDelete.map(async (user) => {
        await strapi.plugins['users-permissions'].services.user.remove({ id: user.id });
    }));
}

export const generateCommunity = async () => {
    const userAleph = await makeUser();
    const userBet = await makeUser();
    const userGimel = await makeUser();
    const userDalet = await makeUser();
    const userHe = await makeUser();
    
    const subnigditAleph = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "TestSubnigditAleph",
            name_uid: "test-subnigdit-aleph",
            description: "Description Aleph",
            owner: userGimel.id,
            rules: [
                {
                    "id": 1,
                    "rule": "Thou shalt kill"
                },
                {
                    "id": 2,
                    "rule": "Thou shalt commit adultery"
                },
                {
                    "id": 3,
                    "rule": "Thou shalt steal"
                },
            ]
        }
    })
    const subnigditBet = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "TestSubnigditBet",
            name_uid: "test-subnigdit-bet",
            description: "Description Bet",
            owner: userAleph.id,
            rules: [
                {
                    "id": 1,
                    "rule": "Sic semper evello mortem tyrannis"
                },
            ]
        }
    })
    const subnigditGimel = await strapi.entityService.create("api::subnigdit.subnigdit", {
        data: {
            name: "TestSubnigditGimel",
            name_uid: "test-subnigdit-gimel",
            description: "Description Gimel",
            owner: userHe.id,
            rules: [
                {
                    "id": 1,
                    "rule": "Olo nie jest hetero"
                },
            ]
        }
    })
    const post001 = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Playing EFT",
            description: "has bad influence on your health",
            type: "Text",
            subnigdit: subnigditAleph.id,
            owner: userAleph.id,
            votes: 1,
            nsfw: false
        }
    })
    const post002 = await strapi.entityService.create("api::post.post", {
        data: {
            title: "The Cube",
            description: "Love The Cube",
            type: "Text",
            subnigdit: subnigditBet.id,
            owner: userGimel.id,
            votes: 10,
            nsfw: false
        }
    })
    const post003 = await strapi.entityService.create("api::post.post", {
        data: {
            title: "E1l",
            description: "E2w",
            type: "Text",
            subnigdit: subnigditGimel.id,
            owner: userBet.id,
            votes: 20,
            nsfw: false
        }
    })
    const post004 = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Fibers",
            description: "collect cotton",
            type: "Text",
            subnigdit: subnigditAleph.id,
            owner: userGimel.id,
            votes: 40,
            nsfw: false
        }
    })
    const post005 = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Coal liquefaction",
            description: "1/12",
            type: "Text",
            subnigdit: subnigditGimel.id,
            owner: userAleph.id,
            votes: 50,
            nsfw: false
        }
    })
    const post006 = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Information Entropy",
            description: "1",
            type: "Text",
            subnigdit: subnigditBet.id,
            owner: userBet.id,
            votes: 100,
            nsfw: false
        }
    })
    const post008 = await strapi.entityService.create("api::post.post", {
        data: {
            title: "The Moon",
            description: "2.01 weak",
            type: "Text",
            subnigdit: subnigditGimel.id,
            owner: userBet.id,
            votes: 150,
            nsfw: false
        }
    })
    const post009 = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Random data",
            description: "Disconnected",
            type: "Text",
            subnigdit: subnigditGimel.id,
            owner: userAleph.id,
            votes: 300,
            nsfw: false
        }
    })
    //const post009u = await strapi.entityService.update("api::post.post", post009.id, {data: {createdAt: "2024-04-26T11:00:00.000Z"}}); does not work
    const post010 = await strapi.entityService.create("api::post.post", {
        data: {
            title: "The sun",
            description: "The sun The sun The sun The sun The sun",
            type: "Text",
            subnigdit: subnigditBet.id,
            owner: userHe.id,
            votes: 616,
            nsfw: false
        }
    })
    const post007 = await strapi.entityService.create("api::post.post", {
        data: {
            title: "Moszna",
            description: "52.180622°, 20.756223°",
            type: "Text",
            subnigdit: subnigditAleph.id,
            owner: userDalet.id,
            votes: 120,
            nsfw: false
        }
    })
}