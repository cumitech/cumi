import { Model, Sequelize } from "sequelize";

interface IMetaDataAttributes {
  id: string;
  page: string;
  title: string;
  description: string;
  keywords?: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: string;
  schemaType: string;
  customSchema?: string;
  robots: string;
  author?: string;
  publishedTime?: Date;
  modifiedTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MetaData = (sequelize: Sequelize, DataTypes: any) => {
  const MetaDataModel = sequelize.define<Model<IMetaDataAttributes>>(
    "MetaData",
    {
      id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
      },
      page: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 500],
        },
      },
      keywords: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          const value = this.getDataValue('keywords');
          return value ? value.split(',').map((k: string) => k.trim()) : [];
        },
        set(value: string[] | string) {
          const keywords = Array.isArray(value) ? value.join(', ') : value;
          this.setDataValue('keywords', keywords);
        },
      },
      canonical: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
          isValidUrl(value: string) {
            if (!value) return;
            try {
              new URL(value);
            } catch (e) {
              throw new Error('Invalid URL format');
            }
          },
        },
      },
      ogTitle: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      ogDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 500],
        },
      },
      ogImage: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isValidUrl(value: string) {
            if (!value) return;
            try {
              new URL(value);
            } catch (e) {
              throw new Error('Invalid URL format');
            }
          },
        },
      },
      ogUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isValidUrl(value: string) {
            if (!value) return;
            try {
              new URL(value);
            } catch (e) {
              throw new Error('Invalid URL format');
            }
          },
        },
      },
      ogType: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'website',
        validate: {
          isIn: [['website', 'article', 'blog', 'product', 'book', 'profile', 'music.song', 'music.album', 'music.playlist', 'video.movie', 'video.episode', 'video.tv_show', 'video.other']],
        },
      },
      twitterTitle: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      twitterDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 500],
        },
      },
      twitterImage: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isValidUrl(value: string) {
            if (!value) return;
            try {
              new URL(value);
            } catch (e) {
              throw new Error('Invalid URL format');
            }
          },
        },
      },
      twitterCard: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'summary_large_image',
        validate: {
          isIn: [['summary', 'summary_large_image', 'app', 'player']],
        },
      },
      schemaType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'WebPage',
        validate: {
          isIn: [['WebPage', 'Article', 'BlogPosting', 'Product', 'Service', 'Course', 'Event', 'Organization', 'Person', 'FAQPage', 'HowTo', 'Review', 'Recipe', 'VideoObject', 'AudioObject']],
        },
      },
      customSchema: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      robots: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'index, follow',
        validate: {
          isIn: [['index, follow', 'index, nofollow', 'noindex, follow', 'noindex, nofollow', 'noindex, nofollow, noarchive, nosnippet', 'index, follow, noarchive', 'index, follow, nosnippet']],
        },
      },
      author: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      publishedTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      modifiedTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "meta_data",
      timestamps: true,
      hooks: {
        beforeUpdate: (instance: any) => {
          instance.modifiedTime = new Date();
        },
      },
    }
  );

  return MetaDataModel;
};

export type { IMetaDataAttributes };
export default MetaData;
