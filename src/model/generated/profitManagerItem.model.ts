import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class ProfitManagerItem {
  constructor(props?: Partial<ProfitManagerItem>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  timestamp!: bigint

  @Column_("numeric", {nullable: false})
  oruFromFee!: number

  @Column_("numeric", {nullable: false})
  usdcFromInvest!: number

  @Column_("numeric", {nullable: false})
  oruArbitrager!: number

  @Column_("numeric", {nullable: false})
  oruPenalty!: number

  @Column_("numeric", {nullable: false})
  totalInOru!: number

  @Column_("numeric", {nullable: false})
  totalInUsd!: number
}
