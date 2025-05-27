const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const {
      name, value, ticketsLeft, ticketPrice,
      endDate, category, featured
    } = req.body;

    // Store only the relative path (for public access)
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newPost = new Post({
      name,
      value,
      ticketsLeft,
      ticketPrice,
      endDate,
      category,
      featured: featured || false,
      image
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// exports.getAllPosts = async (req, res) => {
//   try {
//     const posts = await Post.find().sort({ createdAt: -1 });

//     const formattedPosts = posts.map(post => ({
//       ...post._doc,
//       image: post.image
//         ? `${req.protocol}://${req.get('host')}/${post.image.replace(/\\/g, '/')}`
//         : null
//     }));

//     res.status(200).json(formattedPosts);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

