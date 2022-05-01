module.exports = class Init1651008764741 {
  name = 'Init1651008764741'

  async up(db) {
    await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "from" text NOT NULL, "to" text NOT NULL, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "tvl_chart" ("id" character varying NOT NULL, "current_timestamp" numeric NOT NULL, "end_timestamp" numeric NOT NULL, "value" numeric NOT NULL, CONSTRAINT "PK_f66cd7d4c33771e532ab8517aa1" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "profit_manager_item" ("id" character varying NOT NULL, "timestamp" numeric NOT NULL, "oru_from_fee" numeric NOT NULL, "usdc_from_invest" numeric NOT NULL, "oru_arbitrager" numeric NOT NULL, "oru_penalty" numeric NOT NULL, "total_in_oru" numeric NOT NULL, "total_in_usd" numeric NOT NULL, CONSTRAINT "PK_9afcf452354ea96d8d11671eb1a" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "transfer"`)
    await db.query(`DROP TABLE "tvl_chart"`)
    await db.query(`DROP TABLE "profit_manager_item"`)
  }
}
