using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNotificationEntity3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_notifications_users_receiver_id",
                table: "notifications");

            migrationBuilder.AlterColumn<string>(
                name: "receiver_id",
                table: "notifications",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "group_id",
                table: "notifications",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "notification_groups",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_notification_groups", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "notification_group_members",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    notification_group_id = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    joined_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_notification_group_members", x => x.id);
                    table.ForeignKey(
                        name: "fk_notification_group_members_notification_groups_notification",
                        column: x => x.notification_group_id,
                        principalTable: "notification_groups",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_notification_group_members_users_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_notifications_group_id",
                table: "notifications",
                column: "group_id");

            migrationBuilder.CreateIndex(
                name: "ix_notification_group_members_notification_group_id",
                table: "notification_group_members",
                column: "notification_group_id");

            migrationBuilder.CreateIndex(
                name: "ix_notification_group_members_user_id",
                table: "notification_group_members",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "fk_notifications_notification_groups_group_id",
                table: "notifications",
                column: "group_id",
                principalTable: "notification_groups",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_notifications_users_receiver_id",
                table: "notifications",
                column: "receiver_id",
                principalTable: "AspNetUsers",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_notifications_notification_groups_group_id",
                table: "notifications");

            migrationBuilder.DropForeignKey(
                name: "fk_notifications_users_receiver_id",
                table: "notifications");

            migrationBuilder.DropTable(
                name: "notification_group_members");

            migrationBuilder.DropTable(
                name: "notification_groups");

            migrationBuilder.DropIndex(
                name: "ix_notifications_group_id",
                table: "notifications");

            migrationBuilder.DropColumn(
                name: "group_id",
                table: "notifications");

            migrationBuilder.AlterColumn<string>(
                name: "receiver_id",
                table: "notifications",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "fk_notifications_users_receiver_id",
                table: "notifications",
                column: "receiver_id",
                principalTable: "AspNetUsers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
