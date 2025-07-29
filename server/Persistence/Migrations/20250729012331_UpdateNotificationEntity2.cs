using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNotificationEntity2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_notifications_users_receiver_id",
                table: "notifications");

            migrationBuilder.DropColumn(
                name: "received_id",
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
                name: "received_id",
                table: "notifications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "fk_notifications_users_receiver_id",
                table: "notifications",
                column: "receiver_id",
                principalTable: "AspNetUsers",
                principalColumn: "id");
        }
    }
}
